import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, TerraformReference, CloudFrontConfig } from '@canvascloud/shared';
import { BaseGenerator } from './base.generator';

export class CloudFrontGenerator extends BaseGenerator {
  readonly resourceType = 'cloudfront';

  generate(node: CanvasNode, references: TerraformReference[]): string {
    const config = node.data.config as CloudFrontConfig;
    const name = toTerraformName(node.data.label || node.id);

    // Resolve origin from references
    const originRef = this.findReference(node.id, 'origin.domain_name', references);
    
    // Determine origin type and name
    let originType = config.origin_type || 's3';
    let domainName = config.origin_domain_name ? `"${config.origin_domain_name}"` : '"mybucket.s3.amazonaws.com"';
    
    if (originRef) {
      domainName = originRef.terraformExpression;
      // If the reference expression contains "aws_s3_bucket", it's S3. Otherwise, custom/ALB.
      if (domainName.includes('aws_s3_bucket')) {
        originType = 's3';
      } else {
        originType = 'custom';
      }
    }

    const originId = originType === 's3' ? 'S3-Origin' : 'Custom-Origin';

    const parts: string[] = [];
    parts.push(`resource "aws_cloudfront_distribution" "${name}" {`);
    parts.push(`  origin {`);
    parts.push(`    domain_name = ${domainName}`);
    parts.push(`    origin_id   = "${originId}"`);

    if (originType === 'custom') {
      parts.push(`    custom_origin_config {`);
      parts.push(`      http_port              = 80`);
      parts.push(`      https_port             = 443`);
      parts.push(`      origin_protocol_policy = "http-only"`);
      parts.push(`      origin_ssl_protocols   = ["TLSv1.2"]`);
      parts.push(`    }`);
    } else {
      // S3 origin default OAI configuration is standard, but simple bucket access is enough for generation
      parts.push(`    s3_origin_config {`);
      parts.push(`      origin_access_identity = ""`);
      parts.push(`    }`);
    }
    parts.push(`  }`);

    parts.push(`  enabled             = ${config.enabled !== undefined ? config.enabled : true}`);
    parts.push(`  is_ipv6_enabled     = ${config.is_ipv6_enabled !== undefined ? config.is_ipv6_enabled : true}`);
    
    if (config.default_root_object) {
      parts.push(`  default_root_object = "${config.default_root_object}"`);
    }
    if (config.price_class) {
      parts.push(`  price_class         = "${config.price_class}"`);
    }
    if (config.web_acl_id) {
      parts.push(`  web_acl_id          = "${config.web_acl_id}"`);
    }

    // Default Cache Behavior
    parts.push(`  default_cache_behavior {`);
    const allowed = config.allowed_methods && config.allowed_methods.length > 0
      ? `[${config.allowed_methods.map(m => `"${m}"`).join(', ')}]`
      : '["GET", "HEAD"]';
    const cached = config.cached_methods && config.cached_methods.length > 0
      ? `[${config.cached_methods.map(m => `"${m}"`).join(', ')}]`
      : '["GET", "HEAD"]';
    parts.push(`    allowed_methods  = ${allowed}`);
    parts.push(`    cached_methods   = ${cached}`);
    parts.push(`    target_origin_id = "${originId}"`);
    parts.push(`    viewer_protocol_policy = "${config.viewer_protocol_policy || 'redirect-to-https'}"`);

    parts.push(`    forwarded_values {`);
    parts.push(`      query_string = false`);
    parts.push(`      cookies {`);
    parts.push(`        forward = "none"`);
    parts.push(`      }`);
    parts.push(`    }`);
    parts.push(`  }`);

    // Restrictions (standard empty block required by Terraform)
    parts.push(`  restrictions {`);
    parts.push(`    geo_restriction {`);
    parts.push(`      restriction_type = "none"`);
    parts.push(`    }`);
    parts.push(`  }`);

    // Certificate
    if (config.acm_certificate_arn) {
      parts.push(`  viewer_certificate {`);
      parts.push(`    acm_certificate_arn      = "${config.acm_certificate_arn}"`);
      parts.push(`    ssl_support_method       = "sni-only"`);
      parts.push(`    minimum_protocol_version = "${config.minimum_protocol_version || 'TLSv1.2_2021'}"`);
      parts.push(`  }`);
    } else {
      parts.push(`  viewer_certificate {`);
      parts.push(`    cloudfront_default_certificate = true`);
      parts.push(`  }`);
    }

    if (config.aliases && config.aliases.length > 0) {
      const aliasesVal = `[${config.aliases.map(a => `"${a}"`).join(', ')}]`;
      parts.push(`  aliases             = ${aliasesVal}`);
    }

    const tagsHcl = this.formatTags(config.tags, node.data.label || node.id);
    if (tagsHcl) {
      parts.push(this.indent(tagsHcl, 2));
    }

    parts.push('}');
    return parts.join('\n');
  }
}
