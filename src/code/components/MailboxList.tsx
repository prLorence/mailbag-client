import React from "react";

import Chip from "@mui/material/Chip";
import List from "@mui/material/List";

import { IMailbox } from "../IMAP";

type Props = {
  state: any;
}

const MailboxList = ({ state } : Props): JSX.Element => (
  <List>
    {state.mailboxes.map( (mailbox: IMailbox) => {
      return (
        <Chip label={ `${mailbox.name}` }
            onClick={ () => state.setCurrentMailbox(mailbox.path) }
            style={{ width: 128, marginBottom: 10 }}
            color={ state.currentMailbox === mailbox.path ? "secondary" : "primary" }
        />
      );
    })}
  </List>
)

export default MailboxList;