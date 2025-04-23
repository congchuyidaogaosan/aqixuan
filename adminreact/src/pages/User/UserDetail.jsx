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
  const [photos, setPhotos] = useState([]);
  
  const isCreateMode = id === 'new';

  // 监听表单值变化
  const handleValuesChange = (changedValues, allValues) => {
    console.log('表单值变化:', changedValues);
    console.log('所有表单值:', allValues);
    
    // 只在carouselImgs是数组时更新photos状态
    if (changedValues.carouselImgs && Array.isArray(changedValues.carouselImgs)) {
      console.log('更新照片列表:', changedValues.carouselImgs);
      setPhotos(changedValues.carouselImgs);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setUploadingAvatar(true);
    
    try {
      const currentPhotos = [...photos];
      console.log('上传前 - 当前照片列表:', currentPhotos);
      
      if (currentPhotos.length >= 6) {
        message.error('最多只能上传6张头像照片');
        onError(new Error('最多只能上传6张头像照片'));
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadFile(formData);
      console.log('上传响应:', response);
      const { code, data, msg } = response;
      
      if (code === 200 && data) {
        onSuccess();
        // 检查返回的数据格式，确保获取正确的URL
        const uploadedUrl = typeof data === 'string' ? data : data.url;
        console.log('上传的图片URL:', uploadedUrl);
        
        if (uploadedUrl) {
          // 更新照片列表
          const updatedPhotos = [...currentPhotos, uploadedUrl];
          console.log('更新后的照片列表:', updatedPhotos);
          setPhotos(updatedPhotos);
          
          // 更新表单数据
          const formData = {
            carouselImgs: updatedPhotos,
            handImg: currentPhotos.length === 0 ? uploadedUrl : form.getFieldValue('handImg')
          };
          console.log('设置到表单的数据:', formData);
          
          // 使用setTimeout确保在下一个事件循环中设置表单值
          setTimeout(() => {
            form.setFieldsValue(formData);
          }, 0);
          
          message.success('头像上传成功');
        } else {
          onError(new Error('上传失败：未获取到图片地址'));
          message.error('上传失败：未获取到图片地址');
        }
      } else {
        onError(new Error(msg || '上传失败'));
        message.error(msg || '上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      onError(error);
      message.error('头像上传失败');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 处理头像删除
  const handleAvatarRemove = (index) => {
    const currentPhotos = [...photos];
    console.log('删除前的照片列表:', currentPhotos);
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    console.log('删除后的照片列表:', newPhotos);
    
    setPhotos(newPhotos);
    
    const formData = {
      carouselImgs: newPhotos,
      handImg: currentPhotos[index] === form.getFieldValue('handImg') ? (newPhotos[0] || '') : form.getFieldValue('handImg')
    };
    console.log('删除时设置到表单的数据:', formData);
    form.setFieldsValue(formData);
  };

  // 设置主头像
  const setMainAvatar = (url) => {
    form.setFieldsValue({ handImg: url });
    message.success('已设为主头像');
  };

  // 获取用户详情
  const fetchUserDetail = async () => {
    if (isCreateMode) {
      const initialValues = {
        handImg: '',
        carouselImgs: [],
        nickname: '',
        phone: '',
      };
      setPhotos([]);
      form.setFieldsValue(initialValues);
      return;
    }

    setLoading(true);
    try {
      const { code, data, msg } = await getUserDetail(id);
      console.log('获取到的原始用户数据:', data);
      
      if (code === 200 && data) {
        // 确保carouselImgs是数组
        const carouselImgs = Array.isArray(data.carouselImgs) ? data.carouselImgs : 
                            typeof data.carouselImgs === 'string' ? [data.carouselImgs] : [];
        console.log('处理后的照片列表:', carouselImgs);
        
        // 设置照片列表状态
        setPhotos(carouselImgs);
        
        // 转换数据格式
        const formattedUser = {
          ...data,
          location: data.location ? data.location.split(' ') : [],
          interests: data.interests ? data.interests.split('、') : [],
          sports: data.sports ? data.sports.split('、') : [],
          carouselImgs: carouselImgs,
          handImg: data.handImg || (carouselImgs.length > 0 ? carouselImgs[0] : '')
        };
        
        setUser(formattedUser);
        
        // 使用setTimeout确保在下一个事件循环中设置表单值
        setTimeout(() => {
          form.setFieldsValue({
            ...formattedUser,
            birthday: formattedUser.birthday ? moment(formattedUser.birthday) : undefined,
          });
        }, 0);
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
      console.log('提交的原始数据:', values);
      
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
        carouselImgs: Array.isArray(values.carouselImgs) ? values.carouselImgs : [],
      };

      if (!isCreateMode) {
        submitData.id = id;
      }

      console.log('处理后的提交数据:', submitData);

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
          onValuesChange={handleValuesChange}
          initialValues={{
            carouselImgs: [],
            handImg: ''
          }}
        >
          <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
              <Form.Item
                name="handImg"
                label="主头像"
                style={{ marginBottom: 8 }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {photos.length > 0 && (
                    <Avatar 
                      size={120} 
                      src={photos[0]} 
                      icon={<UserOutlined />}
                    />
                  )}
                </div>
              </Form.Item>

              <Form.Item
                name="carouselImgs"
                label="头像照片（最多6张，点击设为主头像）"
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                  {photos.map((url, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <Avatar
                        size={104}
                        src={url}
                        style={{ 
                          cursor: 'pointer',
                          border: url === form.getFieldValue('handImg') ? '2px solid #1890ff' : 'none'
                        }}
                        onClick={() => setMainAvatar(url)}
                      />
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{
                          position: 'absolute',
                          right: -6,
                          top: -6,
                          color: '#ff4d4f',
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          padding: 4,
                          border: '1px solid #ff4d4f'
                        }}
                        onClick={() => handleAvatarRemove(index)}
                      />
                    </div>
                  ))}
                  {photos.length < 6 && (
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
                      <UploadButton loading={uploadingAvatar} />
                    </Upload>
                  )}
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