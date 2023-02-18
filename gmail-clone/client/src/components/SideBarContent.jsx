import { useState, useContext } from 'react';
import { Button, List, ListItem, Box, styled } from '@mui/material';
import ComposeMail from './ComposeMail';
import { SIDEBAR_DATA } from '../config/sidebar.config';
import { CreateOutlined } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { DataContext } from '../context/DataProvider';

const Container = styled(Box)`
    padding: 8px;
    & > ul {
        padding: 10px 0 0 5px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        & > li > svg {
            margin-right: 20px;
        }
    }
`

const ComposeButton = styled(Button)`
    background: #c2e7ff;
    color: #001d35;
    border-radius: 16px;
    padding: 15px;
    min-width: 140px;
    text-transform: none;
`

const SideBarContent = () => {

    const [openDrawer, setOpenDrawer] = useState(false);

    const { setView } = useContext(DataContext);

    const onComposeClick = () => {
        setOpenDrawer(true);
    }

    const onOptionClick = (value) => {
        setView(value);
    }

    return (
        <Container>
            <ComposeButton onClick={() => onComposeClick()}>
                <CreateOutlined style={{ marginRight: 10 }} />Compose
            </ComposeButton>
            <List>
                {
                    SIDEBAR_DATA.map(data => (
                        <NavLink key={data.title} to={data.path} onClick={onOptionClick(data.name)}>
                            <ListItem><data.icon fontSize="small" />{data.title}</ListItem>
                        </NavLink>
                    ))
                }
            </List>
            <ComposeMail open={openDrawer} />
        </Container>
    )
}

export default SideBarContent;