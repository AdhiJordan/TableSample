import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { Toolbar } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUserDetails, updateUserData} from './actions/index';
import axios from 'axios';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';


const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    padding: "10px",

  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  root: {
   flexGrow: 1,
   background: "#F8F9FB"
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  input: {
    margin: theme.spacing.unit,
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '1 1 100%',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 220,
  },
  iconButton: {
    padding: 10,
    position: 'relative',
    right: "45px"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        rows: [],
        page: 0,
        rowsPerPage: 10,
        selectedId: [],
        selectedActiveUsers: []
    }
  }

  componentDidMount(){
      this.props.getUserDetails();
  }

  componentWillReceiveProps(newProps){
    this.setState({
      rows: [...newProps.userDetails.user]
    }, () => {
      
      this.state.rows.map((user, idx) => {
        let obj = {};
        if(user.active === true){
          obj['index'] = idx;
          obj['active'] = user.active;
          this.state.selectedActiveUsers.push(obj);
        }
        this.setState({
            selectedActiveUsers: this.state.selectedActiveUsers
        })
      })
    })
  }

  handleChangePage(event, page){
    this.setState({ page });
  };

  handleChangeRowsPerPage(event){
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  selectAllUsers(event){
    if(event.target.checked === true){
      this.state.rows.map((data) => {
        this.state.selectedId.push(data.name);
        this.setState({
          selectedId: this.state.selectedId
        })
      })
    }else{
      this.setState({
        selectedId: []
      })
    }
    
  }

  handleChange(name, id){
    if(this.state.selectedId.includes(name) == true){
      this.setState({
        selectedId: this.state.selectedId.filter(el => el !== name)
      })
    }else if(this.state.selectedId.includes(name) == false){
      this.state.selectedId.push(name);
      this.setState({
        selectedId: this.state.selectedId
      })
    }
  }

  swichChecked(toggle, mainIndex, id, event){
    let userData = {};
    userData.active = event.target.checked;
    this.props.updateUserData(mainIndex, userData, id);
  }


  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const isSelected = name => this.state.selectedId.indexOf(name) !== -1;
    return (
      <div className="bgColor">
        <img src="/assets/icons/team.svg" width="60px" className="m-4" /> <label>Users</label>
        <label className="pt-4 pb-4 pr-5 activeUser">Active Users:  {this.state.selectedId.length}</label>
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
              <Table className={classes.table}>
               <TableHead>
                  <TableRow>
                     <TableCell padding="checkbox">
                      <Checkbox

                        onChange={this.selectAllUsers.bind(this)}
                      />
                    </TableCell>
                    <TableCell  style={{color: "#39628D"}}>Type</TableCell>
                    <TableCell  style={{color: "#39628D"}}>Name</TableCell>
                    <TableCell  style={{color: "#39628D"}}>Email</TableCell>
                    <TableCell  style={{color: "#39628D"}}>Telephone</TableCell>
                    <TableCell  style={{color: "#39628D"}}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) =>{
                    let isItemSelected = isSelected(row.name);
                    return(
                      <div style={{display: "contents"}}>
                        <TableRow key={row.id}
                            hover
                            style={{cursor: 'pointer'}}
                          >
                          <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={this.handleChange.bind(this, row.name, idx)}
                              />
                            </TableCell>
                          <TableCell></TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.phone}</TableCell>
                          <TableCell>
                              <Switch
                                  checked={row.active}
                                  onChange={this.swichChecked.bind(this, row.active, row.id,  idx)}
                                />
                          </TableCell>
                        </TableRow>
                        </div>
                    )})}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 48 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </Paper>
        </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({

    userDetails: state.user.userReducers
  
})

const mapDispatchToProps = (dispatch) =>  {
  return bindActionCreators({getUserDetails: getUserDetails, updateUserData: updateUserData}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));