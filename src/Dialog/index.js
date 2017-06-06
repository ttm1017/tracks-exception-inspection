import React, {Component} from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {getMoc} from './mocData';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

export default class extends Component {
    state = {
        trajectoryType: '',
        trajectoryPoints: '',
        trajectoryId: ''
    };

    submitTrajectory = () => {
        const {trajectories, setTrajectories, setDialogShow} = this.props;
        const temporaryTra = trajectories.slice(0);
        if (temporaryTra.some((value) => {
                return value.trajectoryId === this.state.trajectoryId
            })) {
            alert('the name have been exist');
        }
        fetch(`/trajectory?trajectoryType=${this.state.trajectoryType}&trajectoryId=${this.state.trajectoryId}&trajectoryPoints=${encodeURI(this.state.trajectoryPoints)}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw 'Network is not well'
                }
            })
            .then((data) => {
                data.trajectoryPoints = this.state.trajectoryPoints;
                temporaryTra.push(data);
                setTrajectories(temporaryTra);
                setDialogShow(false);
            });
    };

    constructor() {
        super();
        this.submitTrajectory = this.submitTrajectory.bind(this);
    }

    componentDidUpdate() {

    }

    render() {
        const {isDialogShow, setDialogShow, dialogType, trajectories, setExaminationResult} = this.props;
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={() => setDialogShow(false)}
            />,
            <FlatButton
                label="提交"
                primary={true}
                onTouchTap={this.submitTrajectory}
            />,
        ];
        let html;
        if (dialogType === 'input') {
            html = (
                <Dialog
                    title="请输入需要检测的轨迹"
                    actions={actions}
                    modal={false}
                    open={isDialogShow}
                    onRequestClose={() => setDialogShow(false)}
                >

                    <SelectField
                        floatingLabelText="输入检测轨迹类型"
                        value={this.state.trajectoryType}
                        onChange={(event, index, value) => {
                            this.setState({trajectoryType: value})
                        }}
                    >
                        <MenuItem value={'history'} primaryText="与历史数据匹配检测"/>
                        <MenuItem value={'common'} primaryText="普通检测"/>
                    </SelectField>
                    <br />
                    <TextField
                        floatingLabelText="轨迹id"
                        value={this.state.trajectoryId}
                        onChange={(event, value) => {
                            this.setState({trajectoryId: value})
                        }}
                    />
                    <br />
                    <TextField
                        floatingLabelText="输入检测轨迹"
                        multiLine={true}
                        value={this.state.trajectoryPoints}
                        onChange={(event, value) => {
                            this.setState({trajectoryPoints: value})
                        }}
                    />
                    <div className="moc" style={{float: 'right'}}>
                        <FlatButton
                            label="轨迹1"
                            onTouchTap={() => {
                                this.setState({trajectoryPoints: getMoc(1)})
                            }}
                        />
                        <FlatButton
                            label="轨迹2"
                            onTouchTap={() => {
                                this.setState({trajectoryPoints: getMoc(2)})
                            }}
                        />
                    </div>
                </Dialog>
            );
        }
        else {
            console.log(trajectories);
            const arr = trajectories.map((value, index) => {
                return value.outline.map((item, itemIndex) => {
                    return (
                        <TableRow key={value.trajectoryId+itemIndex}>
                            <TableRowColumn>{index+itemIndex}</TableRowColumn>
                            <TableRowColumn>{value.trajectoryId}</TableRowColumn>
                            <TableRowColumn>{item.type}</TableRowColumn>
                            <TableRowColumn>{item.info}</TableRowColumn>
                            {
                                item.partition != null ? <TableRowColumn>
                                    <FlatButton
                                        label="成像"
                                        onTouchTap={() => {
                                            setExaminationResult({
                                                partition: item.partition,
                                                trajectoryPoints: value.trajectoryPoints,
                                                isExcute: true
                                            });
                                            setDialogShow(false)
                                        }}
                                    />
                                </TableRowColumn> : ''
                            }
                        </TableRow>
                    )
                })
            });
            const tableContent = [].concat(...arr);
            html = (
                <Dialog
                    title="检测结果轨迹"
                    actions={actions}
                    modal={false}
                    open={isDialogShow}
                    onRequestClose={() => setDialogShow(false)}
                >
                    <Table>
                        <TableHeader
                            adjustForCheckbox={false}
                            enableSelectAll={false}
                            displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>序号</TableHeaderColumn>
                                <TableHeaderColumn>id</TableHeaderColumn>
                                <TableHeaderColumn>状态</TableHeaderColumn>
                                <TableHeaderColumn>异常信息</TableHeaderColumn>
                                <TableHeaderColumn>是否轨迹成像</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                tableContent
                            }
                        </TableBody>
                    </Table>
                </Dialog>);
        }
        return (
            <div>
                {html}
            </div>
        );

    }
};
