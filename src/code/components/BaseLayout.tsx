import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { Component, useState } from 'react'
import { createState } from '../state';
import Toolbar from "./Toolbar.tsx";
import MailboxList from "./MailboxList.tsx"
import MessageList from "./MessageList.tsx"
import "../../css/main.css";


class BaseLayout extends Component {
  state: any = createState(this);

  render(): JSX.Element {
    return (
    <div className="appContainer">
        <Dialog open={this.state.pleaseWaitVisible} disableEscapeKeyDown= { true }
          transitionDuration={ 0 }
          onClose={( inEvent, inReason ) => {
            if (inReason !== "backdropClick") {
              this.state.showHidePleaseWait(false);
            }
          }}
        >

        <DialogTitle style={{ textAlign: "center"}}> Please Wait </DialogTitle>

        <DialogContent> 
          <DialogContentText> ...Contacting server... </DialogContentText>
        </DialogContent>
      </Dialog>

      <div className="toolbar">
        <Toolbar state={this.state}/>
      </div>

      <div className="mailboxList">
        <MailboxList state={this.state}/>
      </div>

      <div className="centerArea">
        <div className="messageList">
          <MessageList state={this.state}/>
        </div>
      </div>

      <div className="centerViews">
        { this.state.currentView === "welcome" && <WelcomeView/> }
        { (this.state.currentView === "message") || this.state.currentView === "compose" && 
          <MessageView state={this.state}/> }
        {
          (this.state.currentView === "contact" ||
          this.state.currentView === "contactAdd") && <ContactView state={this.state}/>
        }
      </div>
        
      <div className="contactList">
        <ContactList state={this.state} />
      </div>

    </div>
   )
  }
}

export default BaseLayout;
