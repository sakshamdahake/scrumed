import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

// Read issue details
resolver.define('getIssueData', async ({ payload }) => {
  const { issueId } = payload;

  const issueRes = await api.asApp().requestJira(`/rest/api/3/issue/${issueId}?expand=renderedFields`);
  const issue = await issueRes.json();

  return {
    id: issue.id,
    key: issue.key,
    summary: issue.fields.summary,
    description: issue.fields.description,
    status: issue.fields.status.name,
    assignee: issue.fields.assignee?.displayName ?? 'Unassigned',
    comments: issue.fields.comment?.comments ?? []
  };
});

// Communicate data to backend (Fast Api)
resolver.define('sendToAIBackend', async ({ payload }) => {
  const response = await api.fetch('https://xyz.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return await response.json();
});

// Add comment to issue
resolver.define('addComment', async ({ payload }) => {
  const { issueId, comment } = payload;

  const res = await api.asApp().requestJira(`/rest/api/3/issue/${issueId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ body: comment })
  });

  return await res.json();
});

// Assign issue
resolver.define('assignIssue', async ({ payload }) => {
  const { issueId, accountId } = payload;

  const res = await api.asApp().requestJira(`/rest/api/3/issue/${issueId}/assignee`, {
    method: 'PUT',
    body: JSON.stringify({ accountId })
  });

  return { success: true };
});

export const handler = resolver.getDefinitions();