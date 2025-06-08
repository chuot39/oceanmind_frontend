import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Table, Dropdown, Avatar, Tooltip } from 'antd';
// import Highlighter from 'react-highlight-words';
import useSkin from '../../../../../utils/hooks/useSkin';
import { useIntl } from 'react-intl';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoNotificationsOutline, IoNotificationsOffOutline } from 'react-icons/io5';
import { FaSignOutAlt } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useGroupUser } from '@/views/user/components/hook';

const TableGroup = ({ userData, skin }) => {
    const intl = useIntl();
    const searchInput = useRef(null);
    const [notifications, setNotifications] = useState({});
    const { data: groupUser } = useGroupUser(userData?.documentId);
    const navigate = useNavigate();

    console.log('groupUser: ', groupUser)

    const tableData = useMemo(() =>
        groupUser?.map(group => ({
            key: group?.group?.documentId,
            groupName: group?.group?.name,
            admin: group?.members?.filter(item => item?.isAdmin === true) || [],
            members: group?.members || [],
        })) || [],
        [groupUser]
    );

    console.log('tableData: ', tableData)

    const toggleNotification = (groupId) => {
        setNotifications(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleAccessGroup = (record) => {
        console.log('record: ', record)

        navigate(`/social/group/${record?.key}`);
    }

    const getActionMenu = (record) => ({
        items: [
            {
                key: '1',
                label: intl.formatMessage({ id: 'dashboard.group_actions.access' }),
                icon: <FiExternalLink className="text-blue-500" />,
                onClick: () => { handleAccessGroup(record) }
            },
            {
                key: '2',
                label: intl.formatMessage({
                    id: notifications[record.key]
                        ? 'dashboard.group_actions.turn_off_notifications'
                        : 'dashboard.group_actions.turn_on_notifications'
                }),
                icon: notifications[record.key]
                    ? <IoNotificationsOffOutline className="text-amber-500" />
                    : <IoNotificationsOutline className="text-amber-500" />,
                onClick: () => toggleNotification(record.key)
            },
            {
                key: '3',
                label: intl.formatMessage({ id: 'dashboard.group_actions.leave_group' }),
                icon: <FaSignOutAlt className="text-red-500" />,
                danger: true,
                onClick: () => { /* Handle leave group */ }
            },
        ]
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    const columns = [
        {
            title: intl.formatMessage({ id: 'dashboard.group_name' }),
            dataIndex: 'groupName',
            key: 'groupName',
            width: '35%',
            ...getColumnSearchProps('groupName'),
            sorter: (a, b) => a.groupName.localeCompare(b.groupName),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: intl.formatMessage({ id: 'dashboard.admin' }),
            dataIndex: 'admin',
            key: 'admin',
            width: '25%',
            render: (admin) => (
                <Avatar.Group
                    size="default"
                    key={admin?.documentId}
                    max={{
                        count: 2,
                        style: {
                            color: '#f56a00',
                            backgroundColor: '#fde3cf',
                        },
                    }}
                >
                    {admin?.length > 0 && admin?.map((item) => (
                        <Tooltip title={item?.user?.fullname}>
                            <Avatar src={item?.user?.avatar?.file_path} />
                        </Tooltip>
                    ))}

                </Avatar.Group>
            ),
            // sorter: (a, b) => a.admin.localeCompare(b.admin),
            // sortDirections: ['ascend', 'descend'],
        },
        {
            title: intl.formatMessage({ id: 'dashboard.members' }),
            dataIndex: 'members',
            key: 'members',
            width: '25%',
            render: (members) => (
                <Avatar.Group
                    size="default"
                    max={{
                        count: 3,
                        style: {
                            color: '#f56a00',
                            backgroundColor: '#fde3cf',
                        },
                    }}
                >
                    {members.map((member) => (
                        <Tooltip title={member?.user?.fullname}>
                            <Avatar src={member?.user?.avatar?.file_path} />
                        </Tooltip>
                    ))}
                </Avatar.Group>
            ),
            // sorter: (a, b) => a?.members?.length - b?.members?.length,
            // sortDirections: ['ascend', 'descend'],
        },
        {
            title: intl.formatMessage({ id: 'dashboard.actions' }),
            key: 'actions',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={getActionMenu(record)}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<BsThreeDotsVertical className={`text-xl ${skin === 'dark' ? 'text-white' : 'text-gray-600'}`} />}
                    />
                </Dropdown>
            ),
        },
    ];

    const components = {
        header: {
            cell: props => (
                <th
                    {...props}
                    className="bg-[#274db4] text-white border-none py-4"
                />
            )
        }
    };

    return (
        <Card
            title={intl.formatMessage({ id: 'dashboard.your_groups' })}
            className='table-friend'
        >
            <Table
                columns={columns}
                components={components}
                dataSource={tableData}
                bordered={false}
                pagination={{
                    position: ['bottomRight'],
                    className: 'custom-pagination'
                }}
            />
        </Card>
    );
};

export default TableGroup;