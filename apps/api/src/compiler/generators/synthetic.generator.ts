import { toTerraformName } from '@canvascloud/shared';
import type { CanvasNode, CanvasEdge, SyntheticResource } from '@canvascloud/shared';

export class SyntheticGenerator {
  generate(nodes: CanvasNode[], edges: CanvasEdge[]): SyntheticResource[] {
    const nodeMap = new Map<string, CanvasNode>(nodes.map(n => [n.id, n]));
    const syntheticResources: SyntheticResource[] = [];

    for (const edge of edges) {
      const sourceNode = nodeMap.get(edge.source);
      const targetNode = nodeMap.get(edge.target);
      if (!sourceNode || !targetNode) continue;

      const sourceName = toTerraformName(sourceNode.data.label || sourceNode.id);
      const targetName = toTerraformName(targetNode.data.label || targetNode.id);
      const key = `${sourceNode.data.resourceType}->${targetNode.data.resourceType}`;
      const generatedFrom = `edge: ${edge.id} (${key})`;

      switch (key) {
        case 'route-table->subnet': {
          syntheticResources.push({
            type: 'aws_route_table_association',
            name: `rt_assoc_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_route_table_association" "rt_assoc_${sourceName}_${targetName}" {`,
              `  subnet_id      = aws_subnet.${targetName}.id`,
              `  route_table_id = aws_route_table.${sourceName}.id`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'iam-policy->iam-role': {
          syntheticResources.push({
            type: 'aws_iam_role_policy_attachment',
            name: `policy_attach_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_iam_role_policy_attachment" "policy_attach_${sourceName}_${targetName}" {`,
              `  role       = aws_iam_role.${targetName}.name`,
              `  policy_arn = aws_iam_policy.${sourceName}.arn`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'alb->target-group': {
          syntheticResources.push({
            type: 'aws_lb_listener',
            name: `listener_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_lb_listener" "listener_${sourceName}_${targetName}" {`,
              `  load_balancer_arn = aws_lb.${sourceName}.arn`,
              `  port              = 80`,
              `  protocol          = "HTTP"`,
              ``,
              `  default_action {`,
              `    type             = "forward"`,
              `    target_group_arn = aws_lb_target_group.${targetName}.arn`,
              `  }`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'target-group->ec2': {
          syntheticResources.push({
            type: 'aws_lb_target_group_attachment',
            name: `tg_attach_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_lb_target_group_attachment" "tg_attach_${sourceName}_${targetName}" {`,
              `  target_group_arn = aws_lb_target_group.${sourceName}.arn`,
              `  target_id        = aws_instance.${targetName}.id`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'target-group->lambda': {
          syntheticResources.push(
            {
              type: 'aws_lb_target_group_attachment',
              name: `tg_attach_${sourceName}_${targetName}`,
              generatedFrom,
              hcl: [
                `resource "aws_lb_target_group_attachment" "tg_attach_${sourceName}_${targetName}" {`,
                `  target_group_arn = aws_lb_target_group.${sourceName}.arn`,
                `  target_id        = aws_lambda_function.${targetName}.arn`,
                `}`
              ].join('\n')
            },
            {
              type: 'aws_lambda_permission',
              name: `lambda_permission_alb_${sourceName}_${targetName}`,
              generatedFrom,
              hcl: [
                `resource "aws_lambda_permission" "lambda_permission_alb_${sourceName}_${targetName}" {`,
                `  statement_id  = "AllowExecutionFromALB"`,
                `  action        = "lambda:InvokeFunction"`,
                `  function_name = aws_lambda_function.${targetName}.function_name`,
                `  principal     = "elasticloadbalancing.amazonaws.com"`,
                `  source_arn    = aws_lb_target_group.${sourceName}.arn`,
                `}`
              ].join('\n')
            }
          );
          break;
        }

        case 'api-gateway->lambda': {
          syntheticResources.push(
            {
              type: 'aws_apigatewayv2_integration',
              name: `api_integration_${sourceName}_${targetName}`,
              generatedFrom,
              hcl: [
                `resource "aws_apigatewayv2_integration" "api_integration_${sourceName}_${targetName}" {`,
                `  api_id           = aws_apigatewayv2_api.${sourceName}.id`,
                `  integration_type = "AWS_PROXY"`,
                `  integration_uri  = aws_lambda_function.${targetName}.arn`,
                `}`
              ].join('\n')
            },
            {
              type: 'aws_apigatewayv2_route',
              name: `api_route_${sourceName}_${targetName}`,
              generatedFrom,
              hcl: [
                `resource "aws_apigatewayv2_route" "api_route_${sourceName}_${targetName}" {`,
                `  api_id    = aws_apigatewayv2_api.${sourceName}.id`,
                `  route_key = "ANY /{proxy+}"`,
                `  target    = "integrations/\${aws_apigatewayv2_integration.api_integration_${sourceName}_${targetName}.id}"`,
                `}`
              ].join('\n')
            },
            {
              type: 'aws_lambda_permission',
              name: `lambda_permission_api_${sourceName}_${targetName}`,
              generatedFrom,
              hcl: [
                `resource "aws_lambda_permission" "lambda_permission_api_${sourceName}_${targetName}" {`,
                `  statement_id  = "AllowExecutionFromAPIGateway"`,
                `  action        = "lambda:InvokeFunction"`,
                `  function_name = aws_lambda_function.${targetName}.function_name`,
                `  principal     = "apigateway.amazonaws.com"`,
                `  source_arn    = "\${aws_apigatewayv2_api.${sourceName}.execution_arn}/*/*"`,
                `}`
              ].join('\n')
            }
          );
          break;
        }

        case 'iam-role->ec2': {
          syntheticResources.push({
            type: 'aws_iam_instance_profile',
            name: `${targetName}_profile`,
            generatedFrom,
            hcl: [
              `resource "aws_iam_instance_profile" "${targetName}_profile" {`,
              `  name = "${targetName}-profile"`,
              `  role = aws_iam_role.${sourceName}.name`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'igw->route-table': {
          syntheticResources.push({
            type: 'aws_route',
            name: `route_igw_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_route" "route_igw_${sourceName}_${targetName}" {`,
              `  route_table_id         = aws_route_table.${targetName}.id`,
              `  destination_cidr_block = "0.0.0.0/0"`,
              `  gateway_id             = aws_internet_gateway.${sourceName}.id`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'nat-gw->route-table': {
          syntheticResources.push({
            type: 'aws_route',
            name: `route_nat_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_route" "route_nat_${sourceName}_${targetName}" {`,
              `  route_table_id         = aws_route_table.${targetName}.id`,
              `  destination_cidr_block = "0.0.0.0/0"`,
              `  nat_gateway_id         = aws_nat_gateway.${sourceName}.id`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'route53->alb': {
          syntheticResources.push({
            type: 'aws_route53_record',
            name: `route_alb_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_route53_record" "route_alb_${sourceName}_${targetName}" {`,
              `  zone_id = aws_route53_zone.${sourceName}.zone_id`,
              `  name    = "www"`,
              `  type    = "A"`,
              ``,
              `  alias {`,
              `    name                   = aws_lb.${targetName}.dns_name`,
              `    zone_id                = aws_lb.${targetName}.zone_id`,
              `    evaluate_target_health = true`,
              `  }`,
              `}`
            ].join('\n')
          });
          break;
        }

        case 'route53->cloudfront': {
          syntheticResources.push({
            type: 'aws_route53_record',
            name: `route_cf_${sourceName}_${targetName}`,
            generatedFrom,
            hcl: [
              `resource "aws_route53_record" "route_cf_${sourceName}_${targetName}" {`,
              `  zone_id = aws_route53_zone.${sourceName}.zone_id`,
              `  name    = "cdn"`,
              `  type    = "A"`,
              ``,
              `  alias {`,
              `    name                   = aws_cloudfront_distribution.${targetName}.domain_name`,
              `    zone_id                = aws_cloudfront_distribution.${targetName}.hosted_zone_id`,
              `    evaluate_target_health = false`,
              `  }`,
              `}`
            ].join('\n')
          });
          break;
        }
      }
    }

    return syntheticResources;
  }
}
export const SYNTHETIC_GENERATOR = new SyntheticGenerator();
export default SYNTHETIC_GENERATOR;
