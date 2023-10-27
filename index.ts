// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes } from "membrane";

export async function email(msg) {
  // Find related records
  const sender = [await personRecordId(msg.from)];
  const inReplyTo = msg.inReplyTo ? [await emailRecordId(msg.inReplyTo)] : null;

  // Insert new record
  await nodes.emailTable.createRecord({
    fields: {
      Id: msg.id,
      Sender: sender,
      From: msg.from,
      InReplyTo: inReplyTo,
      Subject: msg.subject,
    },
  });
}

// Helpers to get record IDs from a column value.
const personRecordId = (email) => recordId(nodes.peopleTable, "Email", email);
const emailRecordId = (id) => recordId(nodes.emailTable, "Id", id);
async function recordId(table, field, value) {
  const record = await table.records
    .page({ filterByFormula: `{${field}} = "${value}"` })
    .items.$query("id");

  return record[0]?.id;
}
