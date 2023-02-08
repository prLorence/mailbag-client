// noinspection TypeScriptValidateJSTypes
// @ts-nocheck


import React from "react";

import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";


let stateSingleton: any = null;


export function createState(inParentComponent: React.Component): any {

  if (stateSingleton === null) {

    stateSingleton = {

      pleaseWaitVisible : false,

      contacts : [ ],

      mailboxes : [ ],

      messages : [ ],

      currentView : "welcome",

      currentMailbox : null,

      messageID : null,
      messageDate : null,
      messageFrom : null,
      messageTo : null,
      messageSubject : null,
      messageBody : null,

      contactID : null,
      contactName : null,
      contactEmail : null,


      showHidePleaseWait : function(inVisible: boolean): void {

        this.setState(() => ({ pleaseWaitVisible : inVisible }));

      }.bind(inParentComponent), /* End showHidePleaseWait(). */


      showContact : function(inID: string, inName: string, inEmail: string): void {

        console.log("state.showContact()", inID, inName, inEmail);

        this.setState(() => ({
          currentView : "contact", contactID : inID, contactName : inName, contactEmail : inEmail
        }));

      }.bind(inParentComponent), /* End showContact(). */


      showAddContact : function(): void {

        console.log("state.showAddContact()");

        this.setState(() => ({
          currentView : "contactAdd", contactID : null, contactName : "", contactEmail : ""
        }));

      }.bind(inParentComponent), /* End showAddContact(). */


      showMessage : async function(inMessage: IMAP.IMessage): Promise<void> {

        console.log("state.showMessage()", inMessage);

        // Get the message's body.
        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const mb: String = await imapWorker.getMessageBody(inMessage.id, this.state.currentMailbox);
        this.state.showHidePleaseWait(false);

        // Update state.
        this.setState(() => ({
          currentView : "message", messageID : inMessage.id, messageDate : inMessage.date, messageFrom : inMessage.from,
          messageTo : "", messageSubject : inMessage.subject, messageBody : mb
        }));

      }.bind(inParentComponent), /* End showMessage(). */


      showComposeMessage : function(inType: string): void {

        console.log("state.showComposeMessage()");

        switch (inType) {

          case "new":
            this.setState(() => ({
              currentView : "compose", messageTo : "", messageSubject : "", messageBody : "",
              messageFrom : config.userEmail
            }));
          break;

          case "reply":
            this.setState(() => ({
              currentView : "compose", messageTo : this.state.messageFrom,
              messageSubject : `Re: ${this.state.messageSubject}`,
            }));
          break;

          case "contact":
            this.setState(() => ({
              currentView : "compose", messageTo : this.state.contactEmail, messageSubject : "", messageBody : "",
              messageFrom : config.userEmail
            }));
          break;

        }

      }.bind(inParentComponent), /* End showComposeMessage(). */


      addMailboxToList : function(inMailbox: IMAP.IMailbox): void {

        console.log("state.addMailboxToList()", inMailbox);

        this.setState(prevState => ({ mailboxes : [ ...prevState.mailboxes, inMailbox ] }));

      }.bind(inParentComponent), /* End addMailboxToList(). */


      addContactToList : function(inContact: Contacts.IContact): void {

        console.log("state.addContactToList()", inContact);

        this.setState(prevState => ({ contacts : [ ...prevState.contacts, inContact ] }));

      }.bind(inParentComponent), /* End addContactToList(). */


      addMessageToList : function(inMessage: IMAP.IMessage): void {

        console.log("state.addMessageToList()", inMessage);

        this.setState(prevState => ({ messages : [ ...prevState.messages, inMessage ] }));

      }.bind(inParentComponent), /* End addMessageToList(). */


      clearMessages : function(): void {

        console.log("state.clearMessages()");

        this.setState(() => ({ messages : [ ] }));

      }.bind(inParentComponent), /* End clearMessages(). */

      setCurrentMailbox : function(inPath: String): void {

        console.log("state.setCurrentMailbox()", inPath);

        // Update state.
        this.setState(() => ({ currentView : "welcome", currentMailbox : inPath }));

        // Now go get the list of messages for the mailbox.
        this.state.getMessages(inPath);

      }.bind(inParentComponent), /* End setCurrentMailbox(). */


      getMessages : async function(inPath: string): Promise<void> {

        console.log("state.getMessages()");

        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
        this.state.showHidePleaseWait(false);

        this.state.clearMessages();
        messages.forEach((inMessage: IMAP.IMessage) => {
          this.state.addMessageToList(inMessage);
        });

      }.bind(inParentComponent), /* End getMessages(). */


      fieldChangeHandler : function(inEvent: any): void {

        console.log("state.fieldChangeHandler()", inEvent.target.id, inEvent.target.value);

        // Enforce max length for contact name.
        if (inEvent.target.id === "contactName" && inEvent.target.value.length > 16) { return; }

        this.setState(() => ({ [inEvent.target.id] : inEvent.target.value }));

      }.bind(inParentComponent), /* End fieldChangeHandler(). */


      saveContact : async function(): Promise<void> {

        console.log("state.saveContact()", this.state.contactID, this.state.contactName, this.state.contactEmail);

        // Copy list.
        const cl = this.state.contacts.slice(0);

        // Save to server.
        this.state.showHidePleaseWait(true);
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        const contact: Contacts.IContact =
          await contactsWorker.addContact({ name : this.state.contactName, email : this.state.contactEmail });
        this.state.showHidePleaseWait(false);

        // Add to list.
        cl.push(contact);

        // Update state.
        this.setState(() => ({ contacts : cl, contactID : null, contactName : "", contactEmail : "" }));

      }.bind(inParentComponent), /* End saveContact(). */


      deleteContact : async function(): Promise<void> {

        console.log("state.deleteContact()", this.state.contactID);

        // Delete from server.
        this.state.showHidePleaseWait(true);
        const contactsWorker: Contacts.Worker = new Contacts.Worker();
        await contactsWorker.deleteContact(this.state.contactID);
        this.state.showHidePleaseWait(false);

        // Remove from list.
        const cl = this.state.contacts.filter((inElement) => inElement._id != this.state.contactID);

        // Update state.
        this.setState(() => ({ contacts : cl, contactID : null, contactName : "", contactEmail : "" }));

      }.bind(inParentComponent), /* End deleteContact(). */


      /**
       * Delete the currently viewed message.
       */
      deleteMessage : async function(): Promise<void> {

        console.log("state.deleteMessage()", this.state.messageID);

        // Delete from server.
        this.state.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        await imapWorker.deleteMessage(this.state.messageID, this.state.currentMailbox);
        this.state.showHidePleaseWait(false);

        // Remove from list.
        const cl = this.state.messages.filter((inElement) => inElement.id != this.state.messageID);

        // Update state.
        this.setState(() => ({ messages : cl, currentView : "welcome" }));

      }.bind(inParentComponent), /* End deleteMessage(). */

      sendMessage : async function(): Promise<void> {

        console.log("state.sendMessage()", this.state.messageTo, this.state.messageFrom, this.state.messageSubject,
          this.state.messageBody
        );

        // Send the message.
        this.state.showHidePleaseWait(true);
        const smtpWorker: SMTP.Worker = new SMTP.Worker();
        await smtpWorker.sendMessage(this.state.messageTo, this.state.messageFrom, this.state.messageSubject,
          this.state.messageBody
        );
        this.state.showHidePleaseWait(false);

        // Update state.
        this.setState(() => ({ currentView : "welcome" }));

      }.bind(inParentComponent) /* End sendMessage(). */

    };

  }

  return stateSingleton;

} 


 export function getState(): any {

  return stateSingleton;

} /* End getState(). */
