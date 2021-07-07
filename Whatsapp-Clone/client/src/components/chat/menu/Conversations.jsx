import { useState, useEffect, useContext, useRef } from 'react';
import { Box, makeStyles, Divider } from '@material-ui/core';

import { AccountContext } from '../../../context/AccountProvider';

//components
import Conversation from './Conversation';
import { getUsers } from '../../../service/api';

const useStyles = makeStyles({
    component: {
        overflow: 'overlay',
        height: '81vh'
    },
    divider: {
        margin: '0 0 0 67px',
        backgroundColor: '#F2F2F2'
    }
})

const Conversations = () => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);
    
    const { account, socket } = useContext(AccountContext);

    useEffect(() => {
        const fetchData = async () => {
            let data = await getUsers();
            setUsers(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        socket.current.emit('addUser', account.googleId);
        console.log(account)
        socket.current.on("getUsers", users => {
            console.log(users); 
        })
    }, [account])

    return (
        <Box className={classes.component}>
            {
                users && users.map((user, index) => (
                    user.googleId !== account.googleId && 
                        <>
                            <Conversation user={user} />
                            {
                                users.length !== (index + 1)  && <Divider className={classes.divider} />
                            }
                        </>
                ))
            }
        </Box>
    )
}

export default Conversations;