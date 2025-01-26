// get s3 bucket summary from cloudwatch metrics

import {
  CloudWatchClient,
  GetMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";

export const getS3ObjectCountAndTotalSize = async (s3BucketName: string) => {
  const cloudwatch = new CloudWatchClient();

  const command = new GetMetricDataCommand({
    MetricDataQueries: [
      {
        Id: "m1",
        MetricStat: {
          Metric: {
            Namespace: "AWS/S3",
            MetricName: "NumberOfObjects",
            Dimensions: [
              {
                Name: "BucketName",
                Value: s3BucketName,
              },
              {
                Name: "StorageType",
                Value: "AllStorageTypes",
              },
            ],
          },
          Period: 3600,
          Stat: "Sum",
          Unit: "Count",
        },
        ReturnData: true,
      },
      {
        Id: "m2",
        MetricStat: {
          Metric: {
            Namespace: "AWS/S3",
            MetricName: "BucketSizeBytes",
            Dimensions: [
              {
                Name: "BucketName",
                Value: s3BucketName,
              },
              {
                Name: "StorageType",
                Value: "StandardStorage",
              },
            ],
          },
          Period: 3600,
          Stat: "Sum",
          Unit: "Bytes",
        },
        ReturnData: true,
      },
    ],
    StartTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    EndTime: new Date(),
  });

  const response = await cloudwatch.send(command);

  console.log("metrics response", response);

  const objectCount = response.MetricDataResults?.find(
    (result) => result.Id === "m1"
  )?.Values?.[0];
  const totalSizeBytes = response.MetricDataResults?.find(
    (result) => result.Id === "m2"
  )?.Values?.[0];

  return {
    objectCount: objectCount || 0,
    totalSizeBytes: totalSizeBytes || 0,
  };
};
