import { toTerraformName } from '@canvascloud/shared';
import type {
  CanvasNode,
  TerraformReference,
  S3Config,
} from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class S3Generator extends BaseGenerator {
  readonly resourceType = 's3';

  generate(node: CanvasNode, _references: TerraformReference[]): string {
    void _references;
    const config = node.data.config as S3Config;
    const name = toTerraformName(node.data.label || node.id);
    const bucketName = config.bucket || name.replace(/_/g, '-'); // S3 bucket names cannot have underscores

    const parts: string[] = [];

    // 1. Base Bucket resource
    parts.push(`resource "aws_s3_bucket" "${name}" {`);
    parts.push(`  bucket        = "${bucketName}"`);
    if (config.force_destroy !== undefined) {
      parts.push(`  force_destroy = ${config.force_destroy}`);
    }
    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }
    parts.push('}');

    // 2. Versioning Configuration (v4+)
    if (config.versioning_enabled !== undefined) {
      parts.push('');
      parts.push(`resource "aws_s3_bucket_versioning" "${name}_versioning" {`);
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  versioning_configuration {`);
      parts.push(
        `    status = "${config.versioning_enabled ? 'Enabled' : 'Suspended'}"`,
      );
      parts.push(`  }`);
      parts.push('}');
    }

    // 3. Server-side Encryption Configuration (v4+)
    if (config.sse_algorithm) {
      parts.push('');
      parts.push(
        `resource "aws_s3_bucket_server_side_encryption_configuration" "${name}_encryption" {`,
      );
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  rule {`);
      parts.push(`    apply_server_side_encryption_by_default {`);
      parts.push(`      sse_algorithm = "${config.sse_algorithm}"`);
      parts.push(`    }`);
      parts.push(`  }`);
      parts.push('}');
    }

    // 4. Public Access Block (highly recommended best practice, or maps to block_public_access configuration)
    if (config.block_public_access !== undefined || config.acl === 'private') {
      const block =
        config.block_public_access !== undefined
          ? config.block_public_access
          : true;
      parts.push('');
      parts.push(
        `resource "aws_s3_bucket_public_access_block" "${name}_public_access" {`,
      );
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  block_public_acls       = ${block}`);
      parts.push(`  block_public_policy     = ${block}`);
      parts.push(`  ignore_public_acls      = ${block}`);
      parts.push(`  restrict_public_buckets = ${block}`);
      parts.push('}');
    }

    // 5. ACL (v4+ require ownership controls if ACL is enabled, but private is standard)
    if (config.acl && config.acl !== 'private') {
      parts.push('');
      parts.push(
        `resource "aws_s3_bucket_ownership_controls" "${name}_ownership" {`,
      );
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  rule {`);
      parts.push(`    object_ownership = "BucketOwnerPreferred"`);
      parts.push(`  }`);
      parts.push('}');
      parts.push('');
      parts.push(`resource "aws_s3_bucket_acl" "${name}_acl" {`);
      parts.push(
        `  depends_on = [aws_s3_bucket_ownership_controls.${name}_ownership]`,
      );
      parts.push(`  bucket     = aws_s3_bucket.${name}.id`);
      parts.push(`  acl        = "${config.acl}"`);
      parts.push('}');
    }

    // 6. Website Configuration (v4+)
    if (config.website_index_document) {
      parts.push('');
      parts.push(
        `resource "aws_s3_bucket_website_configuration" "${name}_website" {`,
      );
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  index_document {`);
      parts.push(`    suffix = "${config.website_index_document}"`);
      parts.push(`  }`);
      if (config.website_error_document) {
        parts.push(`  error_document {`);
        parts.push(`    key = "${config.website_error_document}"`);
        parts.push(`  }`);
      }
      parts.push('}');
    }

    // 7. CORS Configuration (v4+)
    if (
      config.cors_enabled &&
      config.cors_allowed_origins &&
      config.cors_allowed_origins.length > 0
    ) {
      parts.push('');
      parts.push(
        `resource "aws_s3_bucket_cors_configuration" "${name}_cors" {`,
      );
      parts.push(`  bucket = aws_s3_bucket.${name}.id`);
      parts.push(`  cors_rule {`);
      parts.push(`    allowed_headers = ["*"]`);
      parts.push(
        `    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]`,
      );
      const origins = `[${config.cors_allowed_origins.map((o) => `"${o}"`).join(', ')}]`;
      parts.push(`    allowed_origins = ${origins}`);
      parts.push(`    expose_headers  = []`);
      parts.push(`    max_age_seconds = 3000`);
      parts.push(`  }`);
      parts.push('}');
    }

    return parts.join('\n');
  }
}
