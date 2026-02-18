import React, { useState } from "react";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import styles from "./Pages.module.css";

/**
 * PUBLIC_INTERFACE
 * Settings page for team creation/join (UI-ready). Backend wiring will be added once endpoints exist.
 */
export function SettingsPage() {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState(null);

  return (
    <div className={styles.grid}>
      <Card title="Create a huddle">
        <div className={styles.form}>
          <TextInput
            label="Team name"
            value={teamName}
            onChange={setTeamName}
            placeholder="e.g. Space Rangers"
            help="Creates a new huddle and generates an invite code (once backend is wired)."
          />
          <Button
            onClick={() =>
              setMessage({ variant: "warning", title: "Not wired yet", text: "Backend endpoint missing in OpenAPI." })
            }
            disabled={!teamName.trim()}
          >
            Create team
          </Button>
        </div>
      </Card>

      <Card title="Join via invite code">
        <div className={styles.form}>
          <TextInput
            label="Invite code"
            value={inviteCode}
            onChange={setInviteCode}
            placeholder="e.g. 7QX9K"
            help="Paste a code from a teammate."
          />
          <Button
            variant="secondary"
            onClick={() =>
              setMessage({ variant: "warning", title: "Not wired yet", text: "Backend endpoint missing in OpenAPI." })
            }
            disabled={!inviteCode.trim()}
          >
            Join team
          </Button>
        </div>
      </Card>

      {message && (
        <div className={styles.full}>
          <Alert variant={message.variant} title={message.title}>
            {message.text}
          </Alert>
        </div>
      )}
    </div>
  );
}
