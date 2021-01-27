import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar, Toolbar } from '@material-ui/core';


const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'relative',
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
}));


const chatRoom = [1,2,3,4,5];

export default function ChatRoomLeft () {
    const classes = useStyles();
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    return(
      <div>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
            
            <List 
              button            
              selected
            >
              {chatRoom.map((key) => (
                <ListItem key={key} button selected={selectedIndex === key} onClick={() => setSelectedIndex(key)}>                      
                  <ListItemAvatar>
                    <Avatar src='../../assets/profile.jpg'/>
                  </ListItemAvatar>
                  <ListItemText primary='장충단 길' secondary='고객명'/>
                </ListItem>
              ))}
            </List>
            </div>            
        </Drawer>
      </div>
        
        
        
    );    
};