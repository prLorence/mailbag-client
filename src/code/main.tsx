import "normalize.css";
import "../css/main.css"

import React from "react";
import {createRoot, Root} from "react-dom/client";
import BaseLayout from "./components/BaseLayout";
import { getState } from "./state";

import { Worker as IMAPWorker} from "./IMAP";
import { Worker as ContactsWorker } from "./Contacts"
import { IMailbox } from "./IMAP";
import { IContact } from "./Contacts";

const baseComponent: Root = createRoot(document.getElementById("mainContainer")!);
baseComponent.render(<BaseLayout/>);

const intervalFunction = function(): void {
  if (getState() === null) {
    setTimeout(intervalFunction, 100);
  } else {
    startupFunction();
  }
}

intervalFunction();

const startupFunction = function(): void {
  getState().showHidePleaseWait(true);
  
  async function getMailboxes(): Promise<any> {
    const imapWorker: IMAPWorker = new IMAPWorker();

    const mailboxes: IMailbox[] = await imapWorker.listMailboxes();

    mailboxes.forEach((inMailbox) => {
      getState().addMailboxToList(inMailbox);
    })
  }

  getMailboxes().then(function(): void {
    async function getContacts() {
      const contactsWorker: ContactsWorker = new ContactsWorker();

      const contacts: IContact[] = await contactsWorker.listContacts();

      contacts.forEach((inContact) => {
        getState().addContactToList(inContact);
      })
    }
    getContacts().then(() => getState().showHidePleaseWait(false));
  })
}
