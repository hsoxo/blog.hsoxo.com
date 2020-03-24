import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded'
import ArchiveIcon from '@material-ui/icons/Archive'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { Link } from 'gatsby'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'rgba(250,250,250,0.1)',
    boxShadow: 'none',
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 999,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'grey',
  },
  title: {
    flexGrow: 1,
  },
}))

export default function Header() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    drawer: false,
  })

  const toggleDrawer = value => event => {
    setState({ drawer: value })
  }

  return (
    <div style={{height: 'calc(100vw / 15)'}}>
      <AppBar className={classes.root} position="sticky">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onMouseEnter={toggleDrawer(true)}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} />
          {/*<Button color="inherit"></Button>*/}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="top"
        open={state.drawer}
        onClose={toggleDrawer(false)}
      >
        <List onMouseLeave={toggleDrawer(false)}>
          <Link to="/">
            <ListItem button key="Home">
              <ListItemIcon>
                <HomeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </Link>
          <Link to="/archives">
            <ListItem button key="Archives">
              <ListItemIcon>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Archives" />
            </ListItem>
          </Link>
          <Link to="/tags">
            <ListItem button key="Tags">
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Tags" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}
