import { BaseGuardrailRule } from './base.rule';
import { OpenSGRule } from './open-sg.rule';
import { PublicRDSRule } from './public-rds.rule';
import { NoEncryptionRule } from './no-encryption.rule';
import { DefaultVPCRule } from './default-vpc.rule';
import { MissingIGWRule } from './missing-igw.rule';
import { NoSGAttachedRule } from './no-sg-attached.rule';
import { IAMWildcardRule } from './iam-wildcard.rule';
import { PublicLambdaRule } from './public-lambda.rule';
import { NoNATRule } from './no-nat.rule';
import { MissingRouteTableRule } from './missing-route-table.rule';
import { PublicS3Rule } from './public-s3.rule';
import { NoLambdaRoleRule } from './no-lambda-role.rule';
import { ASGNoHealthCheckRule } from './asg-no-health-check.rule';
import { WideOpenEgressRule } from './wide-open-egress.rule';

export * from './base.rule';
export * from './open-sg.rule';
export * from './public-rds.rule';
export * from './no-encryption.rule';
export * from './default-vpc.rule';
export * from './missing-igw.rule';
export * from './no-sg-attached.rule';
export * from './iam-wildcard.rule';
export * from './public-lambda.rule';
export * from './no-nat.rule';
export * from './missing-route-table.rule';
export * from './public-s3.rule';
export * from './no-lambda-role.rule';
export * from './asg-no-health-check.rule';
export * from './wide-open-egress.rule';

export const ALL_RULES: BaseGuardrailRule[] = [
  new OpenSGRule(),
  new PublicRDSRule(),
  new NoEncryptionRule(),
  new DefaultVPCRule(),
  new MissingIGWRule(),
  new NoSGAttachedRule(),
  new IAMWildcardRule(),
  new PublicLambdaRule(),
  new NoNATRule(),
  new MissingRouteTableRule(),
  new PublicS3Rule(),
  new NoLambdaRoleRule(),
  new ASGNoHealthCheckRule(),
  new WideOpenEgressRule(),
];
export default ALL_RULES;
