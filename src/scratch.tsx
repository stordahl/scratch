import { Action, ActionPanel, Form, LocalStorage } from "@raycast/api";
import { useState, useEffect } from "react";

interface Pad {
  content:string
  isLoading:boolean
}

export default function Command() {
  const [pad, setPad] = useState<Pad>({
    content: '',
    isLoading: true
  });

  useEffect(() => {
    (async () => {
      const stored = await LocalStorage.getItem<string>('scratch-pad');
      if(!stored){
        setPad((previous:Pad) => ({ ...previous, isLoading: false }));
        return; 
      }

      try {
        const content:string = JSON.parse(stored);
        setPad((previous:Pad) => ({ ...previous, content, isLoading: false }));
      } catch (e) {
        console.error(e)
        setPad((previous:Pad) => ({ ...previous, content: '', isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem('scratch-pad', JSON.stringify(pad.content));
  }, [pad.content]);

  return (
    <Form
    actions={
      <ActionPanel>
        <Action.SubmitForm
          title="Save Pad"
          onSubmit={(values) => LocalStorage.setItem('scratch-pad', JSON.stringify(values.content))}
        />
      </ActionPanel>
    }
    >
      <Form.TextArea
        id="content"
        value={pad.content}
        onChange={(v:string) => setPad((previous:Pad) => ({ ...previous, content: v }))}
      />
    </Form>
  );
}
