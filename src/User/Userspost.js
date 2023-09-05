import React, { useState, useEffect } from 'react';
import './../css/App.css';
import { Pagination } from 'antd';
import Table from 'react-bootstrap/Table';
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { API_URL, USER_DETAILS } from '../Constant';
import $ from 'jquery'; 
function Home() {
    const navigate = useNavigate();
    const LOGIN_USER = USER_DETAILS();
    const [limitval, setLimitval] = useState([]);
    const [currentpage, setCurrentpage] = useState(1);
    const [postsperpage, setPostsperpage] = useState(10);
    const [alltotal, setAlltotal] = useState(0);
    var [pagingcounter, setPagingcounter] = useState(1);
    var [userslist, setUserslist] = useState([]);
    const [newdata, setNewdata] = useState([]);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState('');
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [content, setContent] = useState('');
    const handleClose = () => {setShow(false)};
    const handleShow = () => setShow(true);
    useEffect(() => {
        document.title = "MERN Technology || Users - Post";
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        getdata(currentpage, postsperpage);
        getUserdata();
    }, []);
    async function getUserdata() {
        let result = await fetch(`${API_URL}/all-users`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json()
        if (result.status === 200) {
            // console.log(result.list);
            setUserslist(result.list)
        } else {
            alert(result.message);
        }
    }
    async function getdata(page, size) {
        if (LOGIN_USER === false) {
            window.localStorage.clear();
            navigate('./../../');
            return;
        }
        let result = await fetch(`${API_URL}/users/post-list?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'authorization': LOGIN_USER.token,
            }
        });
        result = await result.json()
        if (result.status === 200) {
            setCurrentpage(result.list.page);
            setPostsperpage(result.list.limit);
            setAlltotal(result.list.totalDocs);
            setNewdata(result.list.docs);
            setPagingcounter(result.list.pagingCounter);
            if (result.list.totalDocs <= 5) {
                setLimitval([5]);
            } else if (result.list.totalDocs <= 10) {
                setLimitval([5, 10]);
            } else if (result.list.totalDocs <= 25) {
                setLimitval([5, 10, 25]);
            } else if (result.list.totalDocs <= 50) {
                setLimitval([5, 10, 25, 50]);
            } else if (result.list.totalDocs <= 100) {
                setLimitval([5, 10, 25, 50, 100]);
            } else {
                setLimitval([5, 10, 25, 50, 100]);
            }
        } else {
            alert(result.message);
        }
    }
    async function changePage(page) {
        getdata(page, postsperpage);
    }
   
    
    async function changeperPage(e) {
        if (e.target.value === "Limit") {
            getdata(1, 5);
            setPostsperpage(5);
            setCurrentpage(1);
        } else {
            getdata(1, e.target.value);
            setPostsperpage(e.target.value);
            setCurrentpage(1);
        }
    }
    async function saveData(){
        console.log({'user':user,'title':title,'type':type,'content':content});
    }
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Users Post</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th colSpan={6}>
                            <select id='limit' name='limit' onChange={(e) => changeperPage(e)} className='limit' defaultValue={5}>
                                <option value="5">Limit</option>
                                {
                                    limitval.map((item, index) =>
                                        <option value={item} key={index}>{item}</option>
                                    )
                                }
                            </select>
                            <button 
                            id='modal_btn'
                            type='button' 
                            className='btn btn-primary btn-sm m-2' 
                            alert="Add New" title='Add New' 
                            style={{ float:'right' }} 
                            onClick={() => handleShow()}
                            >
                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            </button>
                            <p style={{ textAlign: "right" }}> Total: {alltotal} of {pagingcounter + newdata.length - 1}</p>
                        </th>

                    </tr>
                    <tr>
                        <th className='th-center'>#</th>
                        <th className='th-center'>User Name</th>
                        <th className='th-center'>Title</th>
                        <th className='th-center'>Type</th>
                        <th className='th-center'>Content</th>
                        <th className='th-center'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        newdata.map((item, index) =>
                            <tr key={index} id={index}>
                                <td align='center'>{pagingcounter++}</td>
                                <td align='center'>{item.user_field.name}</td>
                                <td align='center'>{item.title}</td>
                                <td align='center'>{item.type}</td>
                                <td align='center'>{item.content}</td>
                                <td align='center'>Action</td>
                            </tr>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={6} align='center'>
                            <Pagination pageSize={postsperpage} total={alltotal} current={currentpage} onChange={(value) => changePage(value)} showQuickJumper />
                        </td>
                    </tr>
                </tfoot>
            </Table>


            <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form>
            <div className="form-group m-1">
                <label htmlFor="user">User</label>
                <select className="form-control" id="user" name='user'  onChange={(e)=>setUser(e.target.value)}>
                    <option value={''}>Select User</option>
                    {
                        userslist.map((item, index) =>
                            <option value={item._id} key={index}>{item.name}</option>
                        )
                    }
                </select>
            </div>
            <div className="form-group m-1">
                <label htmlFor="title">Title</label>
                <input
                type="text"
                className="form-control"
                id="title"
                name='title'
                placeholder="Title"
                onChange={(e)=>setTitle(e.target.value)}
                />
            </div>
            <div className="form-group m-1">
                <label htmlFor="type">Type</label>
                <select className="form-control" id="type" name='type'  onChange={(e)=>setType(e.target.value)}>
                    <option value={''}>Select Type</option>
                    <option value={'song'}>Song</option>
                    <option value={'sport'}>Sport</option>
                </select>
            </div>
            <div className="form-group m-1">
                <label htmlFor="content">Content</label>
                <textarea rows={5} className='form-control' id="content" name='content' onChange={(e)=>setContent(e.target.value)}>

                </textarea>
            </div>
            </form>
 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>saveData()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    )
}

export default Home;