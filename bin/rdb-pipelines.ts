#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RdbPipelinesStack } from '../lib/rdb-pipelines-stack';
import { Issue15711 } from "../lib/stack";

const app = new cdk.App();
new Issue15711(app, "Issue15711")
// Dummy