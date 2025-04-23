// src/pages/User/UserDetail.js
import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Avatar, message, Tag, Modal, Form, 
  Input, Select, Row, Col, Space, DatePicker, Cascader,
  Upload
} from 'antd';
import { 
  UserOutlined, EditOutlined, RollbackOutlined,
  LoadingOutlined, PlusOutlined, DeleteOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import { getUserDetail, updateUser, createUser } from '../../api/user';
import { uploadFile } from '../../api/file';

// 角色类型选项
const ROLE_TYPES = ['学生', '职场人', '创业者', '自由职业'];

// 行业选项
const INDUSTRIES = ['IT互联网', '金融', '教育', '医疗', '房地产', '其他'];

// 情感状态选项
const EMOTION_STATUS = ['单身', '恋爱中', '已婚'];

// MBTI选项
const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// 交友目的选项
const DATING_PURPOSE = ['找对象', '交朋友', '运动伙伴', '商务合作'];

// 兴趣选项
const INTERESTS = [
  '看电影', '听音乐', '读书', '旅行', '摄影', '美食', 
  '游戏', '购物', '健身', '瑜伽', '绘画', '手工', 
  '烹饪', '园艺', '收藏', '钓鱼', '宠物', '汽车', 
  '时尚', '科技'
];

// 运动选项
const SPORTS = [
  '跑步', '健身', '游泳', '篮球', '足球', '羽毛球', 
  '网球', '乒乓球', '瑜伽', '舞蹈', '滑板', '骑行', 
  '登山', '滑雪', '冲浪', '高尔夫'
];

// 省市区数据
const REGIONS = [
  {
    value: '黑龙江省',
    label: '黑龙江省',
    children: [
      {
        value: '哈尔滨市',
        label: '哈尔滨市',
        children: [
          { value: '道里区', label: '道里区' },
          { value: '南岗区', label: '南岗区' },
          { value: '道外区', label: '道外区' },
          { value: '阿城区', label: '阿城区' },
          { value: '香坊区', label: '香坊区' }
        ]
      },
      {
        value: '齐齐哈尔市',
        label: '齐齐哈尔市',
        children: [
          { value: '龙沙区', label: '龙沙区' },
          { value: '建华区', label: '建华区' }
        ]
      }
    ]
  },
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' }
        ]
      }
    ]
  }
];

const { Option } = Select;

const ActionButton = styled(Button)`
  margin-right: 8px;
`;

const UserInfoContainer = styled.div`
  .avatar-section {
    text-align: center;
    margin-bottom: 24px;
    
    .ant-avatar {
      width: 120px;
      height: 120px;
      margin-bottom: 16px;
    }
  }

  .info-section {
    margin-bottom: 24px;
    
    .info-item {
      margin-bottom: 16px;
      
      .label {
        color: #666;
        margin-bottom: 4px;
      }
      
      .value {
        color: #333;
        font-size: 14px;
      }
    }
  }

  .photos-section {
    margin-bottom: 24px;
    
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
      
      img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
`;

const UploadButton = ({ loading }) => (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>上传</div>
  </div>
);

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  
  const isCreateMode = id === 'new';

  // 获取用户详情
  const fetchUserDetail = async () => {
    if (isCreateMode) {
      // 初始化表单数据
      form.setFieldsValue({
        carouselImgs: [], // 初始化为空数组
      });
      return;
    }

    setLoading(true);
    try {
      const { code, data, msg } = await getUserDetail(id);
      
      if (code === 200 && data) {
        // 转换数据格式
        const formattedUser = {
          ...data,
          location: data.location ? data.location.split(' ') : [],
          interests: data.interests ? data.interests.split('、') : [],
          sports: data.sports ? data.sports.split('、') : [],
          carouselImgs: Array.isArray(data.carouselImgs) ? data.carouselImgs : [], // 确保是数组
        };
        
        setUser(formattedUser);
        
        // 填充表单
        form.setFieldsValue({
          ...formattedUser,
          birthday: formattedUser.birthday ? moment(formattedUser.birthday) : undefined,
        });
      } else {
        message.error(msg || '获取用户详情失败');
      }
    } catch (error) {
      message.error('获取用户详情失败');
      console.error('获取用户详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCreateMode) {
      setEditModalVisible(true);
    } else {
      fetchUserDetail();
    }
  }, [id]);

  // 提交编辑
  const handleSubmit = async (values) => {
    try {
      // 处理日期
      if (values.birthday) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }
      
      // 处理数组数据
      const submitData = {
        ...values,
        location: values.location ? values.location.join(' ') : '',
        interests: values.interests ? values.interests.join('、') : '',
        sports: values.sports ? values.sports.join('、') : '',
      };

      if (!isCreateMode) {
        submitData.id = id;
      }

      const { code, msg, data } = isCreateMode 
        ? await createUser(submitData)
        : await updateUser(submitData);
      
      if (code === 200) {
        message.success(isCreateMode ? '创建用户成功' : '更新用户信息成功');
        setEditModalVisible(false);
        if (isCreateMode) {
          // 创建成功后跳转到用户列表
          navigate('/user');
        } else {
          fetchUserDetail(); // 重新获取用户信息
        }
      } else {
        message.error(msg || (isCreateMode ? '创建用户失败' : '更新用户信息失败'));
      }
    } catch (error) {
      message.error(isCreateMode ? '创建用户失败' : '更新用户信息失败');
      console.error(isCreateMode ? '创建用户失败:' : '更新用户信息失败:', error);
    }
  };

  // 返回列表
  const handleBack = () => {
    navigate('/user');
  };

  // 处理头像上传
  const handleAvatarUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8081/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.code === 200) {
        onSuccess(result);
        form.setFieldsValue({ handImg: result.data });
        message.success('头像上传成功');
      } else {
        onError(new Error(result.msg || '上传失败'));
      }
    } catch (error) {
      onError(error);
      message.error('头像上传失败');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 处理照片墙上传
  const handlePhotoUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUploadingPhotos(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadFile(formData);
      
      const result = await response.json();
      
      if (result.code === 200) {
        onSuccess(result);
        // 获取当前照片列表并添加新照片
        const currentPhotos = form.getFieldValue('carouselImgs') || [];
        const newPhotos = Array.isArray(currentPhotos) ? currentPhotos : [];
        form.setFieldsValue({ 
          carouselImgs: [...newPhotos, result.data]
        });
        message.success('照片上传成功');
      } else {
        onError(new Error(result.msg || '上传失败'));
      }
    } catch (error) {
      onError(error);
      message.error('照片上传失败');
    } finally {
      setUploadingPhotos(false);
    }
  };

  // 处理照片删除
  const handlePhotoRemove = (index) => {
    const currentPhotos = form.getFieldValue('carouselImgs') || [];
    const newPhotos = Array.isArray(currentPhotos) ? currentPhotos.filter((_, i) => i !== index) : [];
    form.setFieldsValue({ carouselImgs: newPhotos });
  };

  if (loading) {
    return <Card loading={true} />;
  }

  return (
    <div>
      <Card 
        title={isCreateMode ? "新增用户" : "用户详情"}
        extra={
          <Space>
            <ActionButton icon={<RollbackOutlined />} onClick={handleBack}>
              返回
            </ActionButton>
            {!isCreateMode && (
              <ActionButton type="primary" icon={<EditOutlined />} onClick={() => setEditModalVisible(true)}>
                编辑
              </ActionButton>
            )}
          </Space>
        }
      >
        {!isCreateMode && user && (
          <UserInfoContainer>
            <Row gutter={24}>
              <Col span={8}>
                <div className="avatar-section">
                  <Avatar size={120} src={user?.handImg} icon={<UserOutlined />} />
                  <h2>{user?.nickname}</h2>
                  <Tag color={user?.isVerified ? 'green' : 'orange'}>
                    {user?.isVerified ? '已认证' : '未认证'}
                  </Tag>
                  {user?.isDeleted && (
                    <Tag color="red">已删除</Tag>
                  )}
                </div>
                
                <div className="photos-section">
                  <h3>照片墙</h3>
                  <div className="photos-grid">
                    {user?.carouselImgs?.map((img, index) => (
                      <img key={index} src={img} alt={`照片${index + 1}`} />
                    ))}
                  </div>
                </div>
              </Col>
              
              <Col span={16}>
                <div className="info-section">
                  <Row gutter={[24, 24]}>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">手机号</div>
                        <div className="value">{user?.phone}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">位置</div>
                        <div className="value">{user?.location}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">生日</div>
                        <div className="value">{user?.birthday}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">身高</div>
                        <div className="value">{user?.height}cm</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">体重</div>
                        <div className="value">{user?.weight}kg</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">MBTI</div>
                        <div className="value">{user?.mbti}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">角色类型</div>
                        <div className="value">{user?.roleType}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">行业</div>
                        <div className="value">{user?.industry}</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="info-item">
                        <div className="label">情感状态</div>
                        <div className="value">{user?.emotionStatus}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">交友目的</div>
                        <div className="value">{user?.datingPurpose}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">兴趣爱好</div>
                        <div className="value">{user?.interests}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">运动</div>
                        <div className="value">{user?.sports}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">简介</div>
                        <div className="value">{user?.introduction}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">注册时间</div>
                        <div className="value">{user?.createdAt}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="info-item">
                        <div className="label">最后更新</div>
                        <div className="value">{user?.updatedAt}</div>
                      </div>
                    </Col>
                    {user?.deleteTime && (
                      <Col span={24}>
                        <div className="info-item">
                          <div className="label">删除时间</div>
                          <div className="value">{user?.deleteTime}</div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </UserInfoContainer>
        )}
      </Card>

      <Modal
        title={isCreateMode ? "新增用户" : "编辑用户信息"}
        open={editModalVisible}
        onCancel={() => {
          if (isCreateMode) {
            navigate('/user');
          } else {
            setEditModalVisible(false);
          }
        }}
        footer={null}
        width={800}
        maskClosable={!isCreateMode}
        closable={!isCreateMode}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
              <Form.Item
                name="handImg"
                label="头像"
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={handleAvatarUpload}
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('只能上传图片文件！');
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('图片必须小于2MB！');
                    }
                    return isImage && isLt2M;
                  }}
                >
                  {form.getFieldValue('handImg') ? (
                    <img 
                      src={form.getFieldValue('handImg')} 
                      alt="头像" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <UploadButton loading={uploadingAvatar} />
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="carouselImgs"
                label="照片墙"
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(Array.isArray(form.getFieldValue('carouselImgs')) ? form.getFieldValue('carouselImgs') : []).map((url, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={url}
                        alt={`照片${index + 1}`}
                        style={{ width: '104px', height: '104px', objectFit: 'cover' }}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{
                          position: 'absolute',
                          right: 4,
                          top: 4,
                          color: '#ff4d4f',
                          background: 'rgba(255, 255, 255, 0.8)',
                        }}
                        onClick={() => handlePhotoRemove(index)}
                      />
                    </div>
                  ))}
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="photo-uploader"
                    showUploadList={false}
                    customRequest={handlePhotoUpload}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('只能上传图片文件！');
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片必须小于2MB！');
                      }
                      return isImage && isLt2M;
                    }}
                  >
                    <UploadButton loading={uploadingPhotos} />
                  </Upload>
                </div>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="nickname"
                label="昵称"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input placeholder="请输入昵称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="location" label="位置">
                <Cascader
                  options={REGIONS}
                  placeholder="请选择位置"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="birthday" label="生日">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="height" label="身高">
                <Input type="number" placeholder="请输入身高(cm)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="weight" label="体重">
                <Input type="number" placeholder="请输入体重(kg)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="roleType" label="角色类型">
                <Select placeholder="请选择角色类型">
                  {ROLE_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="industry" label="行业">
                <Select placeholder="请选择行业">
                  {INDUSTRIES.map(industry => (
                    <Option key={industry} value={industry}>{industry}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emotionStatus" label="情感状态">
                <Select placeholder="请选择情感状态">
                  {EMOTION_STATUS.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mbti" label="MBTI">
                <Select placeholder="请选择MBTI类型">
                  {MBTI_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="datingPurpose" label="交友目的">
                <Select placeholder="请选择交友目的">
                  {DATING_PURPOSE.map(purpose => (
                    <Option key={purpose} value={purpose}>{purpose}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="interests" label="兴趣爱好">
                <Select
                  mode="multiple"
                  placeholder="请选择兴趣爱好"
                  maxTagCount={5}
                  allowClear
                >
                  {INTERESTS.map(interest => (
                    <Option key={interest} value={interest}>{interest}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="sports" label="运动">
                <Select
                  mode="multiple"
                  placeholder="请选择运动"
                  maxTagCount={5}
                  allowClear
                >
                  {SPORTS.map(sport => (
                    <Option key={sport} value={sport}>{sport}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="introduction" label="简介">
                <Input.TextArea rows={4} placeholder="请输入简介" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            {!isCreateMode && (
              <Button onClick={() => setEditModalVisible(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              {isCreateMode ? '创建' : '保存'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetail;