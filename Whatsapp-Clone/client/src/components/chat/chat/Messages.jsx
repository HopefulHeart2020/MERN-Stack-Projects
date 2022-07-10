import { useState, useEffect, useContext, useRef } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import { io } from 'socket.io-client';

import { getMessages, newMessages } from '../../../service/api';
import { AccountContext } from '../../../context/AccountProvider';

//components
import Message from './Message';
import Footer from './Footer';

const useStyles = makeStyles({
    wrapper: {
        backgroundImage: `url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'})`,
        // height: 'calc(100% - 114px)',
        backgroundSize: '50%'
    },
    footer: {
        height: '55px',
        background: '#ededed',
        // position: 'absolute',
        width: '100%',
        // bottom: 0
    },
    component: {
        height: '79vh',
        overflowY: 'scroll'
    },
    container: {
        padding: '1px 80px'
    }
})


const Messages = ({ person, conversation }) => {
    const classes = useStyles();

    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState(null);
    const [value, setValue] = useState();
    const [file, setFile] = useState();

    const scrollRef = useRef();

    const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

    useEffect(() => {
        
        socket.current.on('getMessage', data => {
            setIncomingMessage({
                ...data,
                createdAt: Date.now()
            })
        })
    }, []);
    
    useEffect(() => {
        const getMessageDetails = async () => {
            let data = await getMessages(conversation._id);
            setMessages(data);
        }
        getMessageDetails();
    }, [conversation?._id, person._id, newMessageFlag]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ transition: "smooth" })
    }, [messages]);

    useEffect(() => {
        incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
            setMessages((prev) => [...prev, incomingMessage]);
        
    }, [incomingMessage, conversation]);

    const receiverId = conversation?.members?.find(member => member !== account.sub);
    
    const sendText = async (e) => {
        let code = e.keyCode || e.which;
        if(!value) return;

        if(code === 13) { 
            let message = {};
            if (!file) {
                message = {
                    senderId: account.sub,
                    receiverId: receiverId,
                    conversationId: conversation._id,
                    type: 'text',
                    text: value
                };
            } else {
                message = {
                    senderId: account.sub,
                    conversationId: conversation._id,
                    receiverId: receiverId,
                    type: 'file',
                    body: file,
                    mimeType: file.type,
                    fileName: file.name
                };
            }

            socket.current.emit('sendMessage', message);

            await newMessages(message);

            setValue('');
            setFile();
            setNewMessageFlag(prev => !prev);
        } 
    }

    return (
        <Box className={classes.wrapper}>
            <Box className={classes.component}>
                {
                    messages && messages.map(message => (
                        <Box className={classes.container} ref={scrollRef}>
                            <Message message={message} />
                        </Box>
                    ))
                }
            </Box>
            <Footer sendText={sendText} value={value} setValue={setValue} setFile={setFile} />
        </Box>
    )
}

export default Messages;