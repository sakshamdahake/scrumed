import React, { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';

const App = () => {
  const [summary, setSummary] = useState('');
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const issueData = await invoke('getIssueData', { issueId: 'ISSUE-ID' }); // to be replaced dynamically later
      setIssue(issueData);

      const aiResponse = await invoke('sendToAIBackend', issueData);
      setSummary(aiResponse.summary || 'No summary available.');
    }

    fetchData();
  }, []);

  return (
    <div>
      <h3>Issue: {issue?.summary}</h3>
      <p>Status: {issue?.status}</p>
      <p>Assignee: {issue?.assignee}</p>
      <hr />
      <h4>AI Summary:</h4>
      <p>{summary}</p>
    </div>
  );
};

export default App;