data "aws_route53_zone" "current" {
  name = var.domain
}

resource "aws_route53_record" "current" {
  zone_id = data.aws_route53_zone.current.zone_id
  name    = data.aws_route53_zone.current.name
  type    = "A"

  alias {
    name                   = "d225ihtll6mnsj.cloudfront.net"
    zone_id                = "Z2FDTNDATAQYW2"
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.current.zone_id
  name    = aws_api_gateway_domain_name.current.domain_name
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.current.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.current.regional_zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "current" {
  domain_name               = aws_route53_record.current.name
  subject_alternative_names = ["api.${var.domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = var.env
  }
}

resource "aws_route53_record" "current_certificate" {
  for_each = {
    for domain_validation_option in aws_acm_certificate.current.domain_validation_options : domain_validation_option.domain_name => {
      name   = domain_validation_option.resource_record_name
      record = domain_validation_option.resource_record_value
      type   = domain_validation_option.resource_record_type
    }
  }

  name    = each.value.name
  records = [each.value.record]
  type    = each.value.type
  zone_id = data.aws_route53_zone.current.id
  ttl     = 60
}

resource "aws_acm_certificate_validation" "current" {
  certificate_arn         = aws_acm_certificate.current.arn
  validation_record_fqdns = [for record in aws_route53_record.current_certificate : record.fqdn]
}

output "domain_name" {
  value = aws_route53_record.current.name
}

