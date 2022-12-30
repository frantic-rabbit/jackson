import RetracedEventsBrowser from '@retraced-hq/logs-viewer';
import useSWR from 'swr';

import type { ApiError, ApiSuccess } from 'types';
import type { Project } from 'types/retraced';
import ErrorMessage from '@components/Error';
import Loading from '@components/Loading';
import { fetcher } from '@lib/ui/utils';
import { retracedOptions } from '@lib/env';

const LogsViewer = (props: { project: Project; environmentId: string; groupId: string }) => {
  const { project, environmentId, groupId } = props;

  const token = project.tokens.filter((token) => token.environment_id === environmentId)[0];

  const { data, error } = useSWR<ApiSuccess<{ viewerToken: string }>, ApiError>(
    [`/api/admin/retraced/projects/${project.id}/viewer-token`, `?groupId=${groupId}&token=${token.token}`],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (!data && !error) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  const viewerToken = data?.data?.viewerToken;

  return (
    <>
      {viewerToken && (
        <RetracedEventsBrowser
          host={`${retracedOptions?.host}/viewer/v1`}
          auditLogToken={viewerToken}
          header='Audit Logs'
          customClass={'text-primary dark:text-white'}
        />
      )}
    </>
  );
};

export default LogsViewer;