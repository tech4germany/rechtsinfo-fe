terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

# AWS Amplify is not yet supported by terraform and thus configured manually.
# It's set up to trigger builds from a webhook:
variable "amplify_webhook_url" {
  default = "https://webhooks.amplify.eu-central-1.amazonaws.com/prod/webhooks?id=58ee7d6d-1a2a-48a3-9488-06fe31148c0f&token=RAyQBlZf2lRalgq3ASICLJ1GwoY8jAVlfjpaduc63o"
}

# This role is set up in: https://github.com/tech4germany/rechtsinfo_api
data "aws_iam_role" "lambda_exec" {
  name = "fellows-2020-rechtsinfo-lambda-exec-role"
}

# Create zip file with Lambda function code.
data "archive_file" "lambda_function_payload" {
  type        = "zip"
  output_path = "lambda_function_payload.zip"
  source {
    content  = <<EOF
      const https = require('https');
      const requestBody = "{}";
      const url = '${var.amplify_webhook_url}';

      exports.handler = function (event, context) {
        const request = https.request(new URL(url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
          }
        });
        request.end(requestBody);
      }
EOF
    filename = "index.js"
  }
}

# Defined lambda function.
resource "aws_lambda_function" "main" {
  function_name = "fellows-2020-rechtsinfo-TriggerAmplifyBuild"

  filename = "lambda_function_payload.zip"

  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_function_payload.output_base64sha256
  runtime          = "nodejs12.x"

  role = data.aws_iam_role.lambda_exec.arn
}

# Set up daily re-build.
resource "aws_cloudwatch_event_rule" "daily_frontend_rebuild" {
  name                = "fellows-2020-rechtsinfo-daily-frontend-rebuild"
  schedule_expression = "cron(30 4 * * ? *)"
}

resource "aws_cloudwatch_event_target" "daily_frontend_rebuild" {
  rule = aws_cloudwatch_event_rule.daily_frontend_rebuild.name
  arn  = aws_lambda_function.main.arn
}

# Allow lambda function to be triggered by CloudWatch Events.
resource "aws_lambda_permission" "allow_cloudwatch_invoke" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_frontend_rebuild.arn
}
