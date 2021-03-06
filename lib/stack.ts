import { Construct, Stack, StackProps, Stage, StageProps } from "@aws-cdk/core";
import * as rds from '@aws-cdk/aws-rds';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { InstanceClass, InstanceSize, InstanceType, Vpc } from "@aws-cdk/aws-ec2";
import {AuroraEngineVersion, AuroraMysqlEngineVersion, AuroraPostgresEngineVersion} from "@aws-cdk/aws-rds";

class MyDatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myCluster = new rds.DatabaseCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.aurora({
        version: AuroraEngineVersion.VER_1_19_6,
      }),
      instanceProps: {
        instanceType: InstanceType.of(InstanceClass.R5, InstanceSize.XLARGE8),
        vpc: new Vpc(this, 'vpc'),
      }
    });
    myCluster.addRotationSingleUser(); // <-- This line created the rotation application
  }
}

class MyApplication extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const dbStack = new MyDatabaseStack(this, 'Database');
  }
}

export class Issue15711 extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new ShellStep('synth', {
        input: CodePipelineSource.gitHub('otaviomacedo/rdb-pipelines', 'master'),
        installCommands: ['npm i aws-cdk', 'npm ci'],
        commands: [
          'npm run build',
          'npx cdk synth',
        ],
      }),
      // selfMutation: false,
    });
    pipeline.addStage(new MyApplication(this, 'Prod'));
  }
}