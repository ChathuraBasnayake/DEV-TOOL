export class ProviderGenerator {
  generateProvider(): string {
    return [
      `provider "aws" {`,
      `  region = var.aws_region`,
      `}`
    ].join('\n');
  }

  generateRequiredProviders(): string {
    return [
      `terraform {`,
      `  required_providers {`,
      `    aws = {`,
      `      source  = "hashicorp/aws"`,
      `      version = "~> 5.0"`,
      `    }`,
      `  }`,
      `}`
    ].join('\n');
  }
}

export const PROVIDER_GENERATOR = new ProviderGenerator();
export default PROVIDER_GENERATOR;
