import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as RdbPipelines from '../lib/rdb-pipelines-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RdbPipelines.RdbPipelinesStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
