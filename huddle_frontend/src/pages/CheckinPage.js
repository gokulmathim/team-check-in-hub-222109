import React, { useMemo, useState } from "react";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";
import { Alert } from "../components/Alert";
import styles from "./Pages.module.css";

/**
 * PUBLIC_INTERFACE
 * Check-in submission page (UI-ready). Backend wiring will be added once endpoints exist.
 */
export function CheckinPage() {
  const questions = useMemo(
    () => [
      { id: "q1", text: "What did you do yesterday?" },
      { id: "q2", text: "What will you do today?" },
      { id: "q3", text: "Any blockers?" },
    ],
    []
  );

  const [answers, setAnswers] = useState(() => Object.fromEntries(questions.map((q) => [q.id, ""])));
  const [submitted, setSubmitted] = useState(false);

  const isValid = Object.values(answers).some((v) => v.trim().length > 0);

  return (
    <div className={styles.stack}>
      <Card title="Daily check-in">
        <div className={styles.copy}>Keep it short, keep it real. Retro theme, modern habits.</div>

        <div className={styles.form}>
          {questions.map((q) => (
            <TextInput
              key={q.id}
              label={q.text}
              value={answers[q.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
              placeholder="Type your update…"
            />
          ))}

          <div className={styles.row}>
            <Button
              onClick={() => {
                // Placeholder: ready for backend POST once endpoint exists.
                setSubmitted(true);
              }}
              disabled={!isValid}
            >
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setAnswers(Object.fromEntries(questions.map((q) => [q.id, ""])));
                setSubmitted(false);
              }}
            >
              Clear
            </Button>
          </div>

          {submitted && (
            <Alert title="Saved (locally)">
              This demo UI doesn’t yet persist to the backend because the backend OpenAPI currently lists only <code>/</code>.
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
}
