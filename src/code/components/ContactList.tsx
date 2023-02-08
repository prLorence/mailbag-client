import React from "react";

import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Person from "@mui/icons-material/Person";
import { ListItemButton } from "@mui/material";

import { IContact } from "../Contacts";

type Props = {
  state: any
}

const ContactList = ({ state }: Props ): JSX.Element => (
  <List>
    {
      state.contacts.map((contact: any) => {
        return (
          <ListItem>
            <ListItemButton
              key={ contact } 
              onClick={() => contact.showContact(contact._id, contact.name, contact.email)}
            >
              <ListItemAvatar>
                <Avatar> <Person/> </Avatar>
              </ListItemAvatar>

              <ListItemText primary={ `${contact.name}`} />

            </ListItemButton>
          </ListItem>
        )
      })
    }
  </List>
)

export default ContactList;