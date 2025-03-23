/*
 Navicat Premium Data Transfer

 Source Server         : 孙佳琪
 Source Server Type    : MySQL
 Source Server Version : 50735
 Source Host           : 121.40.178.23:3306
 Source Schema         : servie0118

 Target Server Type    : MySQL
 Target Server Version : 50735
 File Encoding         : 65001

 Date: 23/03/2025 10:06:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity
-- ----------------------------
DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '发布者ID',
  `activity_type` tinyint(4) NOT NULL COMMENT '活动类型',
  `title` varchar(100) NOT NULL COMMENT '活动名称',
  `description` text NOT NULL COMMENT '活动详情',
  `location` varchar(100) NOT NULL COMMENT '活动地点',
  `total_number` int(11) NOT NULL COMMENT '总人数',
  `current_number` int(11) DEFAULT '1' COMMENT '当前人数',
  `end_time` datetime NOT NULL COMMENT '活动截止时间',
  `start_time` datetime NOT NULL COMMENT '活动开始时间',
  `cost` decimal(10,2) DEFAULT NULL COMMENT '活动费用',
  `cost_type` tinyint(4) DEFAULT NULL COMMENT '费用类型',
  `penalty_cost` decimal(10,2) DEFAULT NULL COMMENT '鸽子费',
  `status` tinyint(4) DEFAULT '1' COMMENT '活动状态：1进行中 2已结束 3已取消',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hand_img` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='活动表';

-- ----------------------------
-- Records of activity
-- ----------------------------
BEGIN;
INSERT INTO `activity` (`id`, `user_id`, `activity_type`, `title`, `description`, `location`, `total_number`, `current_number`, `end_time`, `start_time`, `cost`, `cost_type`, `penalty_cost`, `status`, `created_at`, `updated_at`, `hand_img`, `ip`) VALUES (3, 6, 1, '打游戏', '打王者5排', '林翠小区快递超市', 5, 2, '2025-02-04 23:59:00', '2025-02-04 20:32:00', 0.00, 0, 0.00, 1, '2025-02-04 20:21:41', '2025-02-04 20:21:41', 'http://localhost:8081/image/778ea6637d.png', '127.102275,47.261825');
INSERT INTO `activity` (`id`, `user_id`, `activity_type`, `title`, `description`, `location`, `total_number`, `current_number`, `end_time`, `start_time`, `cost`, `cost_type`, `penalty_cost`, `status`, `created_at`, `updated_at`, `hand_img`, `ip`) VALUES (4, 6, 0, '爬山', '爬山，泰山', '南天门索道售票处', 2, 2, '2025-03-07 20:22:00', '2025-03-01 00:00:00', 0.00, 0, 0.00, 1, '2025-02-04 20:23:29', '2025-02-04 20:23:29', 'http://localhost:8081/image/a71ed416ff.jpg', '117.102825,36.254359');
COMMIT;

-- ----------------------------
-- Table structure for activity_signup
-- ----------------------------
DROP TABLE IF EXISTS `activity_signup`;
CREATE TABLE `activity_signup` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `user_id` bigint(20) NOT NULL COMMENT '报名用户ID',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态：1待确认 2已确认 3已拒绝',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_activity_user` (`activity_id`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='活动报名表';

-- ----------------------------
-- Records of activity_signup
-- ----------------------------
BEGIN;
INSERT INTO `activity_signup` (`id`, `activity_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES (1, 3, 7, 1, '2025-02-04 23:05:46', '2025-02-04 23:05:46');
INSERT INTO `activity_signup` (`id`, `activity_id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES (2, 4, 7, 2, '2025-02-05 18:37:11', '2025-02-05 18:46:49');
COMMIT;

-- ----------------------------
-- Table structure for blacklist
-- ----------------------------
DROP TABLE IF EXISTS `blacklist`;
CREATE TABLE `blacklist` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `blocked_user_id` bigint(20) NOT NULL COMMENT '被拉黑用户ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_user_blocked` (`user_id`,`blocked_user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='黑名单表';

-- ----------------------------
-- Records of blacklist
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for chat_message
-- ----------------------------
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sender_id` bigint(20) NOT NULL COMMENT '发送者ID',
  `receiver_id` bigint(20) NOT NULL COMMENT '接收者ID',
  `message_type` tinyint(4) NOT NULL COMMENT '消息类型：1文字 2表情 3图片',
  `content` text NOT NULL COMMENT '消息内容',
  `is_read` tinyint(1) DEFAULT '0' COMMENT '是否已读',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_sender_receiver` (`sender_id`,`receiver_id`) USING BTREE,
  KEY `idx_receiver_sender` (`receiver_id`,`sender_id`) USING BTREE,
  KEY `idx_created_at` (`created_at`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='私信消息表';

-- ----------------------------
-- Records of chat_message
-- ----------------------------
BEGIN;
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (1, 1, 2, 1, '1', 0, '2025-02-19 10:27:42');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (2, 1, 2, 1, '2', 0, '2025-02-19 10:27:50');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (3, 1, 3, 1, '3', 0, '2025-02-19 10:28:01');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (4, 2, 1, 1, '1', 0, '2025-02-19 10:28:07');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (5, 6, 7, 1, '-发 6-》7', 0, '2025-03-05 12:24:13');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (6, 7, 6, 1, '-收 7->6', 0, '2025-03-05 12:24:26');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (7, 6, 6, 1, '5', 0, '2025-03-07 10:08:34');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (8, 7, 7, 1, 'yyyy', 0, '2025-03-07 10:12:09');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (9, 7, 7, 1, 'uuuu', 0, '2025-03-07 10:13:38');
INSERT INTO `chat_message` (`id`, `sender_id`, `receiver_id`, `message_type`, `content`, `is_read`, `created_at`) VALUES (10, 7, 6, 1, 'yyyy', 0, '2025-03-07 10:14:34');
COMMIT;

-- ----------------------------
-- Table structure for follow
-- ----------------------------
DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '关注者ID',
  `followed_user_id` bigint(20) NOT NULL COMMENT '被关注者ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_user_followed` (`user_id`,`followed_user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1586 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='关注关系表';

-- ----------------------------
-- Records of follow
-- ----------------------------
BEGIN;
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1, 1, 2, '2024-01-18 10:00:00');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (2, 1, 3, '2024-01-18 10:00:00');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (3, 2, 1, '2024-01-18 10:00:00');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (4, 3, 1, '2024-01-18 10:00:00');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (16, 7, 6, '2025-01-20 22:51:50');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (17, 1, 74, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (18, 1, 104, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (19, 1, 32, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (20, 1, 26, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (21, 1, 10, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (22, 1, 90, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (23, 1, 80, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (24, 1, 4, '2025-02-05 21:45:11');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (35, 2, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (36, 2, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (37, 2, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (38, 2, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (39, 2, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (40, 2, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (41, 2, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (42, 3, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (43, 3, 93, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (44, 3, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (45, 3, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (46, 3, 73, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (47, 3, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (48, 3, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (49, 4, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (50, 4, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (51, 4, 42, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (52, 4, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (53, 4, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (54, 4, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (55, 4, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (56, 4, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (64, 5, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (65, 5, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (66, 5, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (67, 5, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (68, 5, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (69, 5, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (70, 5, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (71, 5, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (79, 6, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (80, 6, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (81, 6, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (82, 6, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (83, 6, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (84, 6, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (85, 6, 50, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (86, 6, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (94, 7, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (95, 7, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (96, 7, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (97, 7, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (98, 7, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (99, 7, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (100, 7, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (101, 8, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (102, 8, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (103, 8, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (104, 8, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (105, 8, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (106, 8, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (107, 8, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (108, 8, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (116, 9, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (117, 9, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (118, 9, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (119, 9, 77, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (120, 9, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (121, 9, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (122, 9, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (123, 9, 70, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (131, 10, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (132, 10, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (133, 10, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (134, 10, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (135, 10, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (136, 10, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (137, 10, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (138, 10, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (146, 11, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (147, 11, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (148, 11, 90, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (149, 11, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (150, 11, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (151, 11, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (152, 11, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (153, 11, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (161, 12, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (162, 12, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (163, 12, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (164, 12, 46, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (165, 12, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (166, 12, 43, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (167, 12, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (168, 12, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (176, 13, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (177, 13, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (178, 13, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (179, 13, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (180, 13, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (181, 13, 85, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (182, 13, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (183, 13, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (191, 14, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (192, 14, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (193, 14, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (194, 14, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (195, 14, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (196, 14, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (197, 14, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (198, 14, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (206, 15, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (207, 15, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (208, 15, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (209, 15, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (210, 15, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (211, 15, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (212, 15, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (213, 15, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (221, 16, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (222, 16, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (223, 16, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (224, 16, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (225, 16, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (226, 16, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (227, 16, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (228, 16, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (236, 17, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (237, 17, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (238, 17, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (239, 17, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (240, 17, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (241, 17, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (242, 17, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (243, 17, 48, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (251, 18, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (252, 18, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (253, 18, 79, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (254, 18, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (255, 18, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (256, 18, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (257, 18, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (258, 18, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (266, 19, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (267, 19, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (268, 19, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (269, 19, 4, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (270, 19, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (271, 19, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (272, 19, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (273, 19, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (281, 20, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (282, 20, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (283, 20, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (284, 20, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (285, 20, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (286, 20, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (287, 20, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (288, 20, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (296, 21, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (297, 21, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (298, 21, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (299, 21, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (300, 21, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (301, 21, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (302, 21, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (303, 21, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (311, 22, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (312, 22, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (313, 22, 4, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (314, 22, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (315, 22, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (316, 22, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (317, 22, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (318, 22, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (326, 23, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (327, 23, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (328, 23, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (329, 23, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (330, 23, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (331, 23, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (332, 23, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (333, 23, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (341, 24, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (342, 24, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (343, 24, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (344, 24, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (345, 24, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (346, 24, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (347, 24, 46, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (348, 24, 98, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (356, 25, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (357, 25, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (358, 25, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (359, 25, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (360, 25, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (361, 25, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (362, 25, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (363, 25, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (371, 26, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (372, 26, 29, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (373, 26, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (374, 26, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (375, 26, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (376, 26, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (377, 26, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (378, 26, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (386, 27, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (387, 27, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (388, 27, 70, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (389, 27, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (390, 27, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (391, 27, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (392, 27, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (393, 27, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (401, 28, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (402, 28, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (403, 28, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (404, 28, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (405, 28, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (406, 28, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (407, 28, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (408, 28, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (416, 29, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (417, 29, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (418, 29, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (419, 29, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (420, 29, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (421, 29, 50, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (422, 29, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (423, 29, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (431, 30, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (432, 30, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (433, 30, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (434, 30, 29, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (435, 30, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (436, 30, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (437, 30, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (438, 30, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (446, 31, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (447, 31, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (448, 31, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (449, 31, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (450, 31, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (451, 31, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (452, 31, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (453, 31, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (461, 32, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (462, 32, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (463, 32, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (464, 32, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (465, 32, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (466, 32, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (467, 32, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (468, 32, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (476, 33, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (477, 33, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (478, 33, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (479, 33, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (480, 33, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (481, 33, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (482, 33, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (483, 33, 93, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (491, 34, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (492, 34, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (493, 34, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (494, 34, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (495, 34, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (496, 34, 98, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (497, 34, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (498, 34, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (506, 35, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (507, 35, 29, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (508, 35, 48, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (509, 35, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (510, 35, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (511, 35, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (512, 35, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (513, 35, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (521, 36, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (522, 36, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (523, 36, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (524, 36, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (525, 36, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (526, 36, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (527, 36, 64, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (528, 36, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (536, 37, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (537, 37, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (538, 37, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (539, 37, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (540, 37, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (541, 37, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (542, 37, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (543, 37, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (551, 38, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (552, 38, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (553, 38, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (554, 38, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (555, 38, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (556, 38, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (557, 38, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (558, 38, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (566, 39, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (567, 39, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (568, 39, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (569, 39, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (570, 39, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (571, 39, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (572, 39, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (573, 39, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (581, 40, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (582, 40, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (583, 40, 79, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (584, 40, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (585, 40, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (586, 40, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (587, 40, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (588, 40, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (596, 41, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (597, 41, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (598, 41, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (599, 41, 77, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (600, 41, 90, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (601, 41, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (602, 41, 50, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (603, 41, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (611, 42, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (612, 42, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (613, 42, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (614, 42, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (615, 42, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (616, 42, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (617, 42, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (618, 42, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (626, 43, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (627, 43, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (628, 43, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (629, 43, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (630, 43, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (631, 43, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (632, 43, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (633, 43, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (641, 44, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (642, 44, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (643, 44, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (644, 44, 42, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (645, 44, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (646, 44, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (647, 44, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (648, 44, 4, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (656, 45, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (657, 45, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (658, 45, 79, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (659, 45, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (660, 45, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (661, 45, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (662, 45, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (663, 45, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (671, 46, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (672, 46, 78, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (673, 46, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (674, 46, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (675, 46, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (676, 46, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (677, 46, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (678, 46, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (686, 47, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (687, 47, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (688, 47, 98, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (689, 47, 70, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (690, 47, 4, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (691, 47, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (692, 47, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (693, 47, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (701, 48, 14, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (702, 48, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (703, 48, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (704, 48, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (705, 48, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (706, 48, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (707, 48, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (708, 48, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (716, 49, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (717, 49, 85, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (718, 49, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (719, 49, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (720, 49, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (721, 49, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (722, 49, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (723, 49, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (731, 50, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (732, 50, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (733, 50, 91, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (734, 50, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (735, 50, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (736, 50, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (737, 50, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (738, 50, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (746, 51, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (747, 51, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (748, 51, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (749, 51, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (750, 51, 50, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (751, 51, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (752, 51, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (753, 51, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (761, 52, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (762, 52, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (763, 52, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (764, 52, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (765, 52, 46, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (766, 52, 43, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (767, 52, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (768, 52, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (776, 53, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (777, 53, 29, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (778, 53, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (779, 53, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (780, 53, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (781, 53, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (782, 53, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (783, 53, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (791, 54, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (792, 54, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (793, 54, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (794, 54, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (795, 54, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (796, 54, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (797, 54, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (798, 54, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (806, 55, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (807, 55, 29, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (808, 55, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (809, 55, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (810, 55, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (811, 55, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (812, 55, 85, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (813, 55, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (821, 56, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (822, 56, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (823, 56, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (824, 56, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (825, 56, 43, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (826, 56, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (827, 56, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (828, 56, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (836, 57, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (837, 57, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (838, 57, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (839, 57, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (840, 57, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (841, 57, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (842, 57, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (843, 57, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (851, 58, 93, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (852, 58, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (853, 58, 95, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (854, 58, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (855, 58, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (856, 58, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (857, 58, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (858, 58, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (866, 59, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (867, 59, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (868, 59, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (869, 59, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (870, 59, 85, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (871, 59, 73, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (872, 59, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (873, 59, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (881, 60, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (882, 60, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (883, 60, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (884, 60, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (885, 60, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (886, 60, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (887, 60, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (888, 60, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (896, 61, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (897, 61, 91, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (898, 61, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (899, 61, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (900, 61, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (901, 61, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (902, 61, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (903, 61, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (911, 62, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (912, 62, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (913, 62, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (914, 62, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (915, 62, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (916, 62, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (917, 62, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (918, 62, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (926, 63, 91, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (927, 63, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (928, 63, 79, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (929, 63, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (930, 63, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (931, 63, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (932, 63, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (933, 63, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (941, 64, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (942, 64, 43, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (943, 64, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (944, 64, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (945, 64, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (946, 64, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (947, 64, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (948, 64, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (956, 65, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (957, 65, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (958, 65, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (959, 65, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (960, 65, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (961, 65, 59, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (962, 65, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (963, 65, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (971, 66, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (972, 66, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (973, 66, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (974, 66, 103, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (975, 66, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (976, 66, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (977, 66, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (978, 66, 63, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (986, 67, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (987, 67, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (988, 67, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (989, 67, 91, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (990, 67, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (991, 67, 69, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (992, 67, 98, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (993, 67, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1001, 68, 48, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1002, 68, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1003, 68, 16, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1004, 68, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1005, 68, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1006, 68, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1007, 68, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1008, 68, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1016, 69, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1017, 69, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1018, 69, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1019, 69, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1020, 69, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1021, 69, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1022, 69, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1023, 69, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1031, 70, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1032, 70, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1033, 70, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1034, 70, 64, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1035, 70, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1036, 70, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1037, 70, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1038, 70, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1046, 71, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1047, 71, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1048, 71, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1049, 71, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1050, 71, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1051, 71, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1052, 71, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1053, 71, 12, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1061, 72, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1062, 72, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1063, 72, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1064, 72, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1065, 72, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1066, 72, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1067, 72, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1068, 72, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1076, 73, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1077, 73, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1078, 73, 4, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1079, 73, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1080, 73, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1081, 73, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1082, 73, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1083, 73, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1091, 74, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1092, 74, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1093, 74, 77, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1094, 74, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1095, 74, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1096, 74, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1097, 74, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1098, 74, 91, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1106, 75, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1107, 75, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1108, 75, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1109, 75, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1110, 75, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1111, 75, 14, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1112, 75, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1113, 75, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1121, 76, 92, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1122, 76, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1123, 76, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1124, 76, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1125, 76, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1126, 76, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1127, 76, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1128, 76, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1136, 77, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1137, 77, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1138, 77, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1139, 77, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1140, 77, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1141, 77, 85, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1142, 77, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1143, 77, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1151, 78, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1152, 78, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1153, 78, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1154, 78, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1155, 78, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1156, 78, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1157, 78, 98, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1158, 78, 90, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1166, 79, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1167, 79, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1168, 79, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1169, 79, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1170, 79, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1171, 79, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1172, 79, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1173, 79, 46, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1181, 80, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1182, 80, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1183, 80, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1184, 80, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1185, 80, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1186, 80, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1187, 80, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1188, 80, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1196, 81, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1197, 81, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1198, 81, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1199, 81, 79, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1200, 81, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1201, 81, 71, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1202, 81, 32, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1203, 81, 43, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1211, 82, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1212, 82, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1213, 82, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1214, 82, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1215, 82, 64, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1216, 82, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1217, 82, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1218, 82, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1226, 83, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1227, 83, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1228, 83, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1229, 83, 71, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1230, 83, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1231, 83, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1232, 83, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1233, 83, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1241, 84, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1242, 84, 71, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1243, 84, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1244, 84, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1245, 84, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1246, 84, 42, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1247, 84, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1248, 84, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1256, 85, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1257, 85, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1258, 85, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1259, 85, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1260, 85, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1261, 85, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1262, 85, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1263, 85, 102, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1271, 86, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1272, 86, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1273, 86, 40, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1274, 86, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1275, 86, 99, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1276, 86, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1277, 86, 1, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1278, 86, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1286, 87, 101, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1287, 87, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1288, 87, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1289, 87, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1290, 87, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1291, 87, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1292, 87, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1293, 87, 19, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1301, 88, 90, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1302, 88, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1303, 88, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1304, 88, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1305, 88, 28, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1306, 88, 41, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1307, 88, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1308, 88, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1316, 89, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1317, 89, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1318, 89, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1319, 89, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1320, 89, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1321, 89, 56, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1322, 89, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1323, 89, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1331, 90, 107, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1332, 90, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1333, 90, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1334, 90, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1335, 90, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1336, 90, 38, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1337, 90, 73, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1338, 90, 7, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1346, 91, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1347, 91, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1348, 91, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1349, 91, 27, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1350, 91, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1351, 91, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1352, 91, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1353, 91, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1361, 92, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1362, 92, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1363, 92, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1364, 92, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1365, 92, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1366, 92, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1367, 92, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1368, 92, 44, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1376, 93, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1377, 93, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1378, 93, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1379, 93, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1380, 93, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1381, 93, 6, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1382, 93, 75, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1383, 93, 89, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1391, 94, 14, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1392, 94, 80, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1393, 94, 25, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1394, 94, 70, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1395, 94, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1396, 94, 73, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1397, 94, 47, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1398, 94, 68, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1406, 95, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1407, 95, 94, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1408, 95, 20, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1409, 95, 87, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1410, 95, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1411, 95, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1412, 95, 71, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1413, 95, 37, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1421, 96, 63, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1422, 96, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1423, 96, 106, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1424, 96, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1425, 96, 66, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1426, 96, 42, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1427, 96, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1428, 96, 104, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1436, 97, 21, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1437, 97, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1438, 97, 62, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1439, 97, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1440, 97, 109, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1441, 97, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1442, 97, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1443, 97, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1451, 98, 51, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1452, 98, 108, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1453, 98, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1454, 98, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1455, 98, 33, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1456, 98, 8, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1457, 98, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1458, 98, 96, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1466, 99, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1467, 99, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1468, 99, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1469, 99, 76, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1470, 99, 9, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1471, 99, 84, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1472, 99, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1473, 99, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1481, 100, 67, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1482, 100, 49, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1483, 100, 55, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1484, 100, 64, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1485, 100, 97, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1486, 100, 22, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1487, 100, 50, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1488, 100, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1496, 101, 90, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1497, 101, 70, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1498, 101, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1499, 101, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1500, 101, 58, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1501, 101, 23, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1502, 101, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1503, 101, 72, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1511, 102, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1512, 102, 57, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1513, 102, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1514, 102, 61, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1515, 102, 88, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1516, 102, 93, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1517, 102, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1518, 102, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1526, 103, 45, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1527, 103, 60, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1528, 103, 30, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1529, 103, 24, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1530, 103, 105, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1531, 103, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1532, 103, 26, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1533, 103, 77, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1541, 104, 65, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1542, 104, 73, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1543, 104, 11, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1544, 104, 31, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1545, 104, 74, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1546, 104, 18, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1547, 104, 34, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1548, 104, 81, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1556, 105, 82, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1557, 105, 15, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1558, 105, 13, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1559, 105, 36, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1560, 105, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1561, 105, 48, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1562, 105, 17, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1563, 105, 39, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1571, 106, 86, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1572, 106, 52, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1573, 106, 53, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1574, 106, 35, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1575, 106, 100, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1576, 106, 83, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1577, 106, 10, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1578, 106, 54, '2025-02-05 21:58:48');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1580, 6, 35, '2025-02-15 22:23:21');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1584, 6, 54, '2025-02-15 22:25:09');
INSERT INTO `follow` (`id`, `user_id`, `followed_user_id`, `created_at`) VALUES (1585, 6, 13, '2025-02-16 10:40:00');
COMMIT;

-- ----------------------------
-- Table structure for moment
-- ----------------------------
DROP TABLE IF EXISTS `moment`;
CREATE TABLE `moment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `content` text COMMENT '动态内容',
  `location` varchar(100) DEFAULT NULL COMMENT '发布地点',
  `likes_count` int(11) DEFAULT '0' COMMENT '点赞数',
  `comments_count` int(11) DEFAULT '0' COMMENT '评论数',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='动态表';

-- ----------------------------
-- Records of moment
-- ----------------------------
BEGIN;
INSERT INTO `moment` (`id`, `user_id`, `content`, `location`, `likes_count`, `comments_count`, `created_at`, `updated_at`) VALUES (1, 6, '111', '', 0, 0, '2025-01-24 21:39:24', '2025-01-24 21:39:24');
INSERT INTO `moment` (`id`, `user_id`, `content`, `location`, `likes_count`, `comments_count`, `created_at`, `updated_at`) VALUES (2, 6, '111', '', 1, 4, '2025-01-24 21:41:35', '2025-01-24 21:41:35');
INSERT INTO `moment` (`id`, `user_id`, `content`, `location`, `likes_count`, `comments_count`, `created_at`, `updated_at`) VALUES (3, 6, '1111', '', 1, 0, '2025-01-24 22:52:05', '2025-01-26 16:30:34');
COMMIT;

-- ----------------------------
-- Table structure for moment_comment
-- ----------------------------
DROP TABLE IF EXISTS `moment_comment`;
CREATE TABLE `moment_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `moment_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '评论用户ID',
  `content` text NOT NULL COMMENT '评论内容',
  `parent_id` bigint(20) DEFAULT '0' COMMENT '父评论ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_moment_id` (`moment_id`) USING BTREE,
  KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='动态评论表';

-- ----------------------------
-- Records of moment_comment
-- ----------------------------
BEGIN;
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (1, 1, 1, '阿吧啊吧', 0, '2025-01-26 13:54:58');
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (2, 1, 2, '牛逼牛逼', 1, '2025-01-26 13:55:11');
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (3, 2, 7, '1111', 0, '2025-01-26 14:14:13');
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (4, 2, 7, '11111', 3, '2025-01-26 16:36:07');
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (5, 2, 6, '222', 3, '2025-01-26 16:58:23');
INSERT INTO `moment_comment` (`id`, `moment_id`, `user_id`, `content`, `parent_id`, `created_at`) VALUES (6, 2, 6, '222', 3, '2025-01-26 16:58:28');
COMMIT;

-- ----------------------------
-- Table structure for moment_like
-- ----------------------------
DROP TABLE IF EXISTS `moment_like`;
CREATE TABLE `moment_like` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `moment_id` bigint(20) NOT NULL COMMENT '动态ID',
  `user_id` bigint(20) NOT NULL COMMENT '点赞用户ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_moment_user` (`moment_id`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='动态点赞表';

-- ----------------------------
-- Records of moment_like
-- ----------------------------
BEGIN;
INSERT INTO `moment_like` (`id`, `moment_id`, `user_id`, `created_at`) VALUES (14, 3, 7, '2025-01-26 16:32:33');
INSERT INTO `moment_like` (`id`, `moment_id`, `user_id`, `created_at`) VALUES (20, 2, 7, '2025-01-26 16:58:00');
COMMIT;

-- ----------------------------
-- Table structure for moment_media
-- ----------------------------
DROP TABLE IF EXISTS `moment_media`;
CREATE TABLE `moment_media` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `moment_id` bigint(20) NOT NULL COMMENT '动态ID',
  `media_type` tinyint(4) NOT NULL COMMENT '媒体类型：1图片 2视频',
  `media_url` varchar(255) NOT NULL COMMENT '媒体URL',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序顺序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_moment_id` (`moment_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='动态媒体表';

-- ----------------------------
-- Records of moment_media
-- ----------------------------
BEGIN;
INSERT INTO `moment_media` (`id`, `moment_id`, `media_type`, `media_url`, `sort_order`, `created_at`) VALUES (1, 2, 1, 'http://localhost:8081/image/a04682fb14.png', 0, '2025-01-24 21:41:35');
INSERT INTO `moment_media` (`id`, `moment_id`, `media_type`, `media_url`, `sort_order`, `created_at`) VALUES (2, 2, 1, 'http://localhost:8081/image/13d3202da7.png', 0, '2025-01-24 21:41:35');
INSERT INTO `moment_media` (`id`, `moment_id`, `media_type`, `media_url`, `sort_order`, `created_at`) VALUES (3, 3, 1, 'http://localhost:8081/image/82da5c1d38.png', 0, '2025-01-24 22:52:05');
INSERT INTO `moment_media` (`id`, `moment_id`, `media_type`, `media_url`, `sort_order`, `created_at`) VALUES (4, 3, 1, 'http://localhost:8081/image/aad97c7e92.png', 0, '2025-01-24 22:52:05');
INSERT INTO `moment_media` (`id`, `moment_id`, `media_type`, `media_url`, `sort_order`, `created_at`) VALUES (5, 1, 2, 'http://localhost:8081/imags/9e01022d6f.mp4', 0, '2025-01-25 22:13:32');
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) NOT NULL COMMENT '用户昵称',
  `introduction` text COMMENT '个人介绍',
  `location` varchar(100) DEFAULT NULL COMMENT '居住地',
  `height` int(11) DEFAULT NULL COMMENT '身高(cm)',
  `weight` int(11) DEFAULT NULL COMMENT '体重(kg)',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `role_type` varchar(10) DEFAULT NULL COMMENT '角色类型',
  `industry` varchar(50) DEFAULT NULL COMMENT '行业',
  `emotion_status` varchar(10) DEFAULT NULL COMMENT '情感状态',
  `mbti` varchar(10) DEFAULT NULL COMMENT 'MBTI类型',
  `dating_purpose` varchar(10) DEFAULT NULL COMMENT '交友目的',
  `interests` varchar(50) DEFAULT NULL COMMENT '兴趣爱好',
  `sports` varchar(50) DEFAULT NULL COMMENT '运动爱好',
  `ip_address` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `is_verified` tinyint(1) DEFAULT '0' COMMENT '是否实名认证',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '是否注销',
  `delete_time` datetime DEFAULT NULL COMMENT '注销时间',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_phone` (`phone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户基础信息表';

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (1, '15045359422', '1', '1', '1', 1, 1, '2025-01-18', '1', '1', '1', '1', '1', '1', '1', '1', 0, 0, NULL, '2025-01-18 10:13:48', '2025-01-18 10:13:48');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (4, '13800138001', '张三', '热爱生活，喜欢运动', '北京市朝阳区', 180, 70, '1995-01-15', '2', 'IT互联网', '1', 'ENFP', '1', '[\"旅行\", \"摄影\", \"美食\"]', '[\"篮球\", \"健身\"]', '127.0.0.1', 1, 0, NULL, '2024-01-18 10:00:00', '2024-01-18 10:00:00');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (6, '15845587016', '余光', '2233445566', '黑龙江省 哈尔滨市 阿城区', 180, 72, '2002-03-09', '创业者', '医疗', '恋爱中', 'ENFP', '商务合作', '美食、摄影、旅行', '羽毛球、足球、篮球', '126.538048,45.873692', 0, 0, NULL, '2025-01-18 18:53:00', '2025-03-11 20:31:22');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (7, '15845587017', '余光1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '114.1693611,22.3193039', 0, 0, NULL, '2025-01-19 22:03:09', '2025-01-24 23:52:53');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (8, '13800138002', '李四', '追求进步，热爱分享', '上海市浦东新区', 165, 55, '1997-03-20', '1', '教育', '1', 'INTJ', '2', '[\"读书\", \"音乐\", \"电影\"]', '[\"游泳\", \"瑜伽\"]', '127.0.0.1', 1, 0, NULL, '2024-01-18 10:00:00', '2024-01-18 10:00:00');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (9, '13800138003', '王五', '简单生活，快乐运动', '广州市天河区', 175, 65, '1996-06-10', '3', '金融', '2', 'ESTP', '1', '[\"游戏\", \"美食\", \"旅行\"]', '[\"足球\", \"跑步\"]', '127.0.0.1', 1, 0, NULL, '2024-01-18 10:00:00', '2024-01-18 10:00:00');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (10, '1471512920', 'user_4473', '用户介绍：913', '地址：1146', 165, 49, '1971-02-05', '职场人', '其他', '已婚', 'INTP', '找对象', '[\"瑜伽\", \"健身\", \"绘画\"]', '[\"健身\"]', '126.209.215.221', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (11, '1908362065', 'user_5712', '用户介绍：6056', '地址：3141', 188, 90, '1970-02-05', '创业者', '其他', '已婚', 'ENTJ', '找对象', '[\"购物\", \"听音乐\", \"汽车\"]', '[\"篮球\", \"舞蹈\", \"跑步\"]', '85.91.141.165', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (12, '1699746568', 'user_798', '用户介绍：4068', '地址：7946', 188, 63, '1980-02-05', '创业者', '金融', '已婚', 'ISTJ', '商务合作', '[\"烹饪\", \"汽车\", \"绘画\"]', '[\"瑜伽\"]', '92.189.66.37', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (13, '1316733171', 'user_1416', '用户介绍：2060', '地址：6054', 170, 53, '1968-02-05', '创业者', '医疗', '恋爱中', 'ESFP', '运动伙伴', '[\"汽车\", \"读书\", \"科技\", \"瑜伽\"]', '[\"登山\"]', '7.69.213.216', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (14, '1563414038', 'user_6125', '用户介绍：1603', '地址：9641', 167, 89, '2007-02-05', '职场人', '房地产', '恋爱中', 'ISTP', '找对象', '[\"看电影\", \"宠物\", \"时尚\"]', '[\"篮球\"]', '75.23.146.148', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (15, '1871032337', 'user_2073', '用户介绍：9055', '地址：9060', 191, 61, '1995-02-05', '自由职业', '金融', '恋爱中', 'ISTP', '商务合作', '[\"宠物\", \"钓鱼\", \"烹饪\", \"摄影\", \"游戏\"]', '[\"游泳\"]', '39.196.18.12', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (16, '1570577446', 'user_1752', '用户介绍：7587', '地址：2678', 153, 71, '1991-02-05', '学生', '房地产', '单身', 'ESTJ', '商务合作', '[\"游戏\"]', '[\"登山\"]', '29.23.131.20', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (17, '1680161495', 'user_2311', '用户介绍：7508', '地址：609', 152, 44, '1998-02-05', '创业者', '其他', '恋爱中', 'ISTJ', '交朋友', '[\"读书\", \"健身\", \"瑜伽\", \"听音乐\", \"园艺\"]', '[\"滑板\", \"网球\", \"瑜伽\"]', '213.8.36.58', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (18, '1455096061', 'user_4942', '用户介绍：8182', '地址：6086', 180, 47, '1972-02-05', '职场人', '其他', '单身', 'ENTP', '找对象', '[\"时尚\", \"摄影\", \"健身\", \"听音乐\"]', '[\"瑜伽\", \"健身\", \"足球\"]', '244.210.48.198', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (19, '1380529898', 'user_1219', '用户介绍：1937', '地址：6029', 172, 61, '1986-02-05', '创业者', 'IT互联网', '单身', 'INFJ', '交朋友', '[\"收藏\", \"购物\", \"美食\", \"健身\"]', '[\"健身\", \"跑步\", \"游泳\"]', '193.92.144.30', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (20, '1903304991', 'user_4430', '用户介绍：1158', '地址：2503', 196, 86, '2002-02-05', '自由职业', '医疗', '已婚', 'ESTJ', '商务合作', '[\"听音乐\"]', '[\"瑜伽\"]', '148.255.199.229', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (21, '1785892162', 'user_401', '用户介绍：6238', '地址：9989', 156, 77, '1976-02-05', '创业者', '教育', '恋爱中', 'ISFJ', '运动伙伴', '[\"美食\", \"看电影\", \"绘画\"]', '[\"滑板\", \"足球\", \"游泳\"]', '248.111.150.178', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (22, '1832048262', 'user_1019', '用户介绍：5484', '地址：4363', 177, 62, '1996-02-05', '职场人', '医疗', '单身', 'ESFJ', '交朋友', '[\"绘画\", \"购物\"]', '[\"跑步\", \"舞蹈\", \"足球\"]', '93.165.97.89', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (23, '1680692693', 'user_809', '用户介绍：9840', '地址：6774', 172, 48, '1990-02-05', '创业者', '房地产', '单身', 'ISTP', '商务合作', '[\"读书\", \"烹饪\", \"旅行\"]', '[\"足球\"]', '50.37.5.176', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (24, '1195823589', 'user_7156', '用户介绍：7034', '地址：3701', 187, 76, '1976-02-05', '创业者', '房地产', '恋爱中', 'ENTP', '找对象', '[\"时尚\", \"园艺\"]', '[\"冲浪\", \"羽毛球\"]', '27.50.149.4', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (25, '1784514797', 'user_1554', '用户介绍：2419', '地址：7433', 200, 84, '1980-02-05', '学生', '教育', '已婚', 'INTP', '交朋友', '[\"摄影\", \"瑜伽\", \"宠物\", \"美食\"]', '[\"舞蹈\", \"冲浪\"]', '73.194.169.144', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (26, '1829111006', 'user_8580', '用户介绍：4166', '地址：5093', 165, 98, '1969-02-05', '职场人', 'IT互联网', '已婚', 'ENTP', '运动伙伴', '[\"手工\"]', '[\"乒乓球\", \"滑板\", \"骑行\"]', '37.230.24.44', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (27, '1677489788', 'user_735', '用户介绍：430', '地址：9946', 193, 54, '1979-02-05', '创业者', '金融', '已婚', 'ISTJ', '找对象', '[\"游戏\", \"美食\", \"读书\"]', '[\"乒乓球\", \"骑行\"]', '163.103.58.101', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (28, '1898889615', 'user_5323', '用户介绍：6949', '地址：8777', 165, 94, '1985-02-05', '职场人', '医疗', '恋爱中', 'INTJ', '商务合作', '[\"科技\"]', '[\"健身\", \"舞蹈\", \"足球\"]', '177.6.19.234', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (29, '1671935609', 'user_8485', '用户介绍：847', '地址：8780', 156, 42, '1972-02-05', '职场人', '金融', '单身', 'ISTP', '运动伙伴', '[\"摄影\"]', '[\"骑行\"]', '60.187.32.196', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (30, '1342946829', 'user_2906', '用户介绍：1648', '地址：9522', 163, 69, '1982-02-05', '创业者', '教育', '恋爱中', 'INTJ', '商务合作', '[\"看电影\", \"时尚\"]', '[\"羽毛球\"]', '202.59.179.134', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (31, '1965463118', 'user_4936', '用户介绍：5044', '地址：412', 185, 60, '1981-02-05', '学生', '房地产', '单身', 'ENTJ', '运动伙伴', '[\"旅行\", \"宠物\"]', '[\"滑板\"]', '148.138.47.149', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (32, '1780365775', 'user_8036', '用户介绍：6074', '地址：6263', 165, 80, '1990-02-05', '学生', '金融', '恋爱中', 'ISFJ', '商务合作', '[\"购物\"]', '[\"骑行\"]', '145.247.110.185', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (33, '1108317079', 'user_3411', '用户介绍：4564', '地址：2587', 197, 91, '1988-02-05', '自由职业', '房地产', '恋爱中', 'ENFJ', '运动伙伴', '[\"汽车\", \"购物\", \"时尚\", \"旅行\", \"烹饪\"]', '[\"乒乓球\", \"滑板\"]', '61.104.177.124', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (34, '1624518852', 'user_5370', '用户介绍：9499', '地址：1383', 192, 88, '1988-02-05', '创业者', 'IT互联网', '恋爱中', 'ENTJ', '找对象', '[\"时尚\", \"宠物\", \"旅行\", \"钓鱼\"]', '[\"羽毛球\", \"滑雪\"]', '200.230.131.94', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (35, '1956893056', 'user_1299', '用户介绍：9431', '地址：3257', 190, 41, '1978-02-05', '职场人', '教育', '已婚', 'ISFJ', '找对象', '[\"健身\", \"购物\"]', '[\"登山\", \"游泳\"]', '190.157.102.106', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (36, '1690595006', 'user_7255', '用户介绍：9097', '地址：3720', 156, 72, '1994-02-05', '创业者', '其他', '单身', 'ENTJ', '找对象', '[\"时尚\", \"看电影\"]', '[\"跑步\", \"篮球\"]', '72.211.5.20', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (37, '1286918459', 'user_9496', '用户介绍：1405', '地址：8540', 193, 81, '1971-02-05', '自由职业', '医疗', '单身', 'INFP', '商务合作', '[\"绘画\", \"旅行\"]', '[\"高尔夫\", \"滑雪\"]', '113.250.119.165', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (38, '1722029118', 'user_7684', '用户介绍：1815', '地址：6021', 173, 71, '1998-02-05', '职场人', '其他', '恋爱中', 'ISFP', '运动伙伴', '[\"游戏\"]', '[\"乒乓球\", \"舞蹈\", \"冲浪\"]', '135.254.18.73', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (39, '1323355784', 'user_4929', '用户介绍：7641', '地址：3416', 171, 43, '2006-02-05', '创业者', '医疗', '恋爱中', 'ENTJ', '商务合作', '[\"烹饪\", \"钓鱼\", \"看电影\"]', '[\"足球\"]', '215.78.237.130', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (40, '1736663935', 'user_7328', '用户介绍：5642', '地址：6228', 171, 54, '1968-02-05', '创业者', '金融', '恋爱中', 'INFJ', '找对象', '[\"科技\", \"汽车\", \"烹饪\", \"购物\", \"旅行\"]', '[\"登山\", \"舞蹈\", \"游泳\"]', '120.144.29.85', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (41, '1771214188', 'user_4062', '用户介绍：8949', '地址：2557', 180, 52, '1998-02-05', '职场人', '房地产', '恋爱中', 'ISFP', '商务合作', '[\"钓鱼\"]', '[\"冲浪\"]', '40.183.44.160', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (42, '1946507388', 'user_4949', '用户介绍：792', '地址：9116', 166, 92, '1991-02-05', '学生', '房地产', '恋爱中', 'ENFP', '商务合作', '[\"烹饪\", \"汽车\", \"收藏\"]', '[\"游泳\", \"登山\"]', '227.29.126.18', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (43, '1386757744', 'user_6121', '用户介绍：4577', '地址：4526', 195, 45, '1974-02-05', '学生', '房地产', '恋爱中', 'ENTP', '商务合作', '[\"绘画\", \"看电影\", \"收藏\"]', '[\"乒乓球\", \"跑步\"]', '110.127.90.209', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (44, '1645253257', 'user_3334', '用户介绍：3098', '地址：5485', 191, 65, '1979-02-05', '学生', '教育', '已婚', 'ESTJ', '运动伙伴', '[\"汽车\", \"游戏\", \"摄影\", \"看电影\", \"手工\"]', '[\"登山\", \"健身\"]', '52.22.166.80', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (45, '1830510524', 'user_8859', '用户介绍：5145', '地址：9147', 151, 64, '1967-02-05', '创业者', '房地产', '已婚', 'ENFJ', '商务合作', '[\"时尚\", \"汽车\", \"手工\"]', '[\"羽毛球\", \"冲浪\", \"网球\"]', '135.173.181.65', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (46, '1632781295', 'user_9469', '用户介绍：7511', '地址：9151', 166, 92, '1992-02-05', '职场人', '教育', '恋爱中', 'ENFP', '运动伙伴', '[\"听音乐\", \"美食\", \"烹饪\", \"健身\", \"收藏\"]', '[\"篮球\"]', '187.204.212.154', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (47, '1525444398', 'user_9256', '用户介绍：8651', '地址：5484', 157, 45, '2007-02-05', '自由职业', 'IT互联网', '已婚', 'ESTJ', '交朋友', '[\"摄影\", \"宠物\", \"读书\", \"美食\", \"烹饪\"]', '[\"滑板\"]', '59.200.56.28', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (48, '1669518445', 'user_6244', '用户介绍：365', '地址：3096', 172, 56, '1965-02-05', '职场人', '教育', '恋爱中', 'ISFP', '交朋友', '[\"看电影\"]', '[\"篮球\", \"冲浪\"]', '88.160.164.221', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (49, '1342085501', 'user_1197', '用户介绍：3360', '地址：3209', 180, 41, '1994-02-05', '创业者', '房地产', '已婚', 'ESFP', '运动伙伴', '[\"摄影\", \"烹饪\", \"瑜伽\"]', '[\"游泳\"]', '19.50.20.20', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (50, '1425956096', 'user_2106', '用户介绍：2744', '地址：7403', 194, 50, '1998-02-05', '职场人', '房地产', '已婚', 'ESFJ', '商务合作', '[\"旅行\", \"游戏\"]', '[\"舞蹈\"]', '7.203.155.180', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (51, '1314833455', 'user_9213', '用户介绍：1617', '地址：446', 187, 73, '1983-02-05', '自由职业', '医疗', '恋爱中', 'ESFP', '运动伙伴', '[\"收藏\", \"摄影\"]', '[\"网球\", \"瑜伽\", \"游泳\"]', '52.207.155.112', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (52, '1835619112', 'user_3758', '用户介绍：8105', '地址：9253', 159, 52, '1990-02-05', '职场人', '医疗', '已婚', 'INFP', '交朋友', '[\"时尚\"]', '[\"滑雪\"]', '31.119.197.72', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (53, '1588694019', 'user_9972', '用户介绍：3256', '地址：6363', 160, 47, '1966-02-05', '职场人', '教育', '恋爱中', 'ESFP', '找对象', '[\"科技\", \"游戏\"]', '[\"乒乓球\"]', '244.136.92.14', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (54, '1636531233', 'user_9960', '用户介绍：8845', '地址：4344', 176, 57, '1969-02-05', '自由职业', '医疗', '恋爱中', 'ESFJ', '找对象', '[\"园艺\"]', '[\"瑜伽\", \"健身\"]', '72.229.92.176', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (55, '1572460714', 'user_9613', '用户介绍：6328', '地址：2803', 175, 81, '1970-02-05', '学生', '其他', '恋爱中', 'ENTP', '运动伙伴', '[\"健身\", \"看电影\", \"钓鱼\", \"读书\", \"汽车\"]', '[\"滑板\"]', '233.121.55.26', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (56, '1442895664', 'user_57', '用户介绍：7419', '地址：6923', 162, 46, '1973-02-05', '自由职业', '金融', '单身', 'INTP', '找对象', '[\"烹饪\", \"健身\"]', '[\"羽毛球\", \"瑜伽\", \"跑步\"]', '54.180.16.4', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (57, '1893972485', 'user_2956', '用户介绍：6590', '地址：4084', 153, 46, '1994-02-05', '学生', '医疗', '恋爱中', 'ENFP', '找对象', '[\"手工\", \"科技\", \"购物\", \"瑜伽\", \"旅行\"]', '[\"健身\", \"乒乓球\"]', '190.39.51.146', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (58, '1792899099', 'user_5544', '用户介绍：9855', '地址：2640', 168, 41, '2006-02-05', '学生', '房地产', '恋爱中', 'ESFP', '找对象', '[\"瑜伽\", \"园艺\", \"听音乐\"]', '[\"网球\", \"足球\"]', '143.228.123.205', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (59, '1185569656', 'user_961', '用户介绍：9135', '地址：2795', 183, 67, '1996-02-05', '职场人', '金融', '已婚', 'INFP', '运动伙伴', '[\"健身\", \"汽车\", \"旅行\"]', '[\"舞蹈\", \"网球\"]', '202.20.130.158', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (60, '1987291090', 'user_4369', '用户介绍：5661', '地址：5197', 195, 97, '2007-02-05', '职场人', 'IT互联网', '单身', 'ENFP', '运动伙伴', '[\"钓鱼\", \"宠物\", \"健身\", \"旅行\", \"美食\"]', '[\"登山\", \"足球\", \"羽毛球\"]', '92.75.120.133', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (61, '1595136625', 'user_1202', '用户介绍：7471', '地址：3750', 182, 42, '1994-02-05', '自由职业', '教育', '恋爱中', 'ESFP', '运动伙伴', '[\"绘画\"]', '[\"游泳\", \"冲浪\", \"滑板\"]', '115.63.235.117', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (62, '1259125658', 'user_5460', '用户介绍：9567', '地址：1452', 193, 91, '1979-02-05', '自由职业', '房地产', '恋爱中', 'ENTJ', '运动伙伴', '[\"园艺\", \"购物\", \"听音乐\", \"瑜伽\"]', '[\"篮球\", \"骑行\", \"健身\"]', '90.144.124.113', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (63, '1838621775', 'user_4608', '用户介绍：1456', '地址：3457', 164, 65, '1998-02-05', '自由职业', '房地产', '已婚', 'ISFP', '交朋友', '[\"科技\", \"听音乐\", \"时尚\"]', '[\"羽毛球\", \"冲浪\", \"登山\"]', '12.250.153.84', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (64, '1881701679', 'user_5567', '用户介绍：3325', '地址：9924', 199, 91, '1993-02-05', '学生', '其他', '已婚', 'ENFP', '交朋友', '[\"摄影\", \"读书\", \"汽车\", \"烹饪\"]', '[\"游泳\"]', '71.24.125.112', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (65, '1499897481', 'user_9729', '用户介绍：8676', '地址：4196', 175, 53, '1982-02-05', '学生', '金融', '已婚', 'ISFP', '商务合作', '[\"时尚\", \"看电影\", \"读书\"]', '[\"篮球\", \"游泳\"]', '232.56.144.162', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (66, '1596037249', 'user_4428', '用户介绍：3332', '地址：3377', 185, 66, '2004-02-05', '创业者', '金融', '单身', 'ESFJ', '交朋友', '[\"看电影\", \"宠物\", \"瑜伽\", \"健身\", \"听音乐\"]', '[\"冲浪\", \"滑板\"]', '209.21.27.2', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (67, '1868696216', 'user_95', '用户介绍：9867', '地址：9053', 178, 47, '1970-02-05', '学生', '金融', '恋爱中', 'INFJ', '找对象', '[\"读书\", \"健身\", \"游戏\", \"钓鱼\"]', '[\"篮球\", \"网球\"]', '236.168.242.206', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (68, '1902422257', 'user_3336', '用户介绍：5957', '地址：9775', 155, 74, '1984-02-05', '学生', '医疗', '已婚', 'INFP', '找对象', '[\"看电影\", \"手工\", \"健身\", \"读书\", \"绘画\"]', '[\"滑板\", \"冲浪\"]', '126.225.200.97', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (69, '1678869423', 'user_2519', '用户介绍：8938', '地址：7134', 195, 57, '1974-02-05', '学生', 'IT互联网', '恋爱中', 'ISFJ', '找对象', '[\"时尚\", \"收藏\"]', '[\"骑行\", \"网球\"]', '186.251.234.58', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (70, '1362708394', 'user_3569', '用户介绍：9032', '地址：4457', 176, 55, '1976-02-05', '职场人', '其他', '已婚', 'ESTP', '找对象', '[\"读书\", \"美食\", \"收藏\", \"购物\"]', '[\"滑板\"]', '234.37.124.62', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (71, '1986554903', 'user_6605', '用户介绍：7060', '地址：5487', 181, 69, '1985-02-05', '学生', '其他', '单身', 'ESTP', '商务合作', '[\"读书\", \"汽车\", \"游戏\"]', '[\"乒乓球\", \"滑雪\"]', '227.139.91.230', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (72, '1364037921', 'user_4926', '用户介绍：5418', '地址：2315', 177, 98, '1998-02-05', '创业者', '其他', '已婚', 'ENTP', '商务合作', '[\"游戏\"]', '[\"篮球\", \"乒乓球\", \"冲浪\"]', '39.48.106.196', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (73, '1666711721', 'user_4655', '用户介绍：3265', '地址：2361', 160, 58, '1970-02-05', '创业者', '金融', '恋爱中', 'ENFJ', '商务合作', '[\"时尚\"]', '[\"滑雪\"]', '55.239.80.176', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (74, '1481012606', 'user_8210', '用户介绍：6747', '地址：9107', 176, 95, '1965-02-05', '创业者', '其他', '已婚', 'ENFJ', '商务合作', '[\"汽车\", \"读书\"]', '[\"乒乓球\", \"跑步\"]', '222.92.147.254', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (75, '1341480140', 'user_2706', '用户介绍：1087', '地址：7319', 166, 68, '1992-02-05', '自由职业', '房地产', '单身', 'ENTJ', '找对象', '[\"听音乐\"]', '[\"足球\", \"篮球\", \"冲浪\"]', '169.4.160.137', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (76, '1276657765', 'user_3181', '用户介绍：2908', '地址：5000', 182, 78, '1994-02-05', '职场人', '医疗', '恋爱中', 'ESFJ', '交朋友', '[\"园艺\", \"时尚\", \"科技\", \"钓鱼\"]', '[\"乒乓球\", \"网球\"]', '223.23.110.182', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (77, '1318779644', 'user_141', '用户介绍：5074', '地址：4945', 198, 56, '1986-02-05', '创业者', '房地产', '已婚', 'INTP', '交朋友', '[\"看电影\"]', '[\"跑步\", \"登山\"]', '47.45.181.184', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (78, '1441108829', 'user_8671', '用户介绍：1025', '地址：9112', 162, 71, '1973-02-05', '创业者', '医疗', '已婚', 'ISFP', '运动伙伴', '[\"汽车\", \"时尚\"]', '[\"足球\", \"健身\", \"骑行\"]', '244.195.197.238', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (79, '1171139979', 'user_3985', '用户介绍：8585', '地址：969', 196, 55, '1984-02-05', '职场人', '房地产', '单身', 'ISFJ', '找对象', '[\"宠物\", \"美食\", \"听音乐\"]', '[\"乒乓球\"]', '69.35.159.104', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (80, '1675262381', 'user_8276', '用户介绍：8801', '地址：9178', 198, 100, '2003-02-05', '创业者', '医疗', '单身', 'INFP', '商务合作', '[\"瑜伽\", \"园艺\", \"宠物\", \"看电影\"]', '[\"舞蹈\"]', '210.135.193.6', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (81, '1531825092', 'user_2286', '用户介绍：1883', '地址：2557', 186, 88, '1970-02-05', '自由职业', '医疗', '恋爱中', 'ESFP', '交朋友', '[\"钓鱼\"]', '[\"游泳\", \"乒乓球\", \"登山\"]', '201.69.93.126', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (82, '1628721957', 'user_7299', '用户介绍：7879', '地址：7497', 169, 81, '1998-02-05', '学生', '其他', '恋爱中', 'ESTJ', '运动伙伴', '[\"游戏\", \"健身\", \"园艺\", \"听音乐\", \"旅行\"]', '[\"篮球\", \"网球\"]', '45.17.79.20', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (83, '1258082811', 'user_2920', '用户介绍：7178', '地址：7130', 170, 96, '1992-02-05', '学生', '医疗', '已婚', 'INTJ', '运动伙伴', '[\"时尚\", \"园艺\", \"游戏\", \"购物\"]', '[\"舞蹈\"]', '69.242.4.76', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (84, '1211362065', 'user_1553', '用户介绍：4357', '地址：7126', 163, 48, '1967-02-05', '自由职业', '金融', '已婚', 'ESFP', '商务合作', '[\"钓鱼\", \"摄影\", \"烹饪\", \"园艺\", \"宠物\"]', '[\"篮球\", \"骑行\"]', '136.109.60.109', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (85, '1786112187', 'user_1099', '用户介绍：9661', '地址：5009', 180, 72, '1972-02-05', '自由职业', '其他', '已婚', 'INTP', '运动伙伴', '[\"科技\", \"旅行\", \"摄影\"]', '[\"滑板\", \"乒乓球\"]', '90.37.31.105', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (86, '1573699996', 'user_2048', '用户介绍：8134', '地址：4525', 191, 85, '1994-02-05', '学生', '房地产', '已婚', 'ISFJ', '商务合作', '[\"美食\", \"读书\", \"旅行\", \"钓鱼\"]', '[\"篮球\", \"网球\"]', '83.184.41.144', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (87, '1214191633', 'user_751', '用户介绍：9497', '地址：5235', 189, 56, '2005-02-05', '职场人', '金融', '单身', 'ISTJ', '找对象', '[\"听音乐\", \"旅行\"]', '[\"瑜伽\", \"乒乓球\"]', '154.169.82.173', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (88, '1590501478', 'user_8938', '用户介绍：7541', '地址：892', 159, 79, '1977-02-05', '自由职业', '其他', '已婚', 'ENFJ', '运动伙伴', '[\"汽车\", \"科技\", \"园艺\"]', '[\"骑行\", \"跑步\", \"游泳\"]', '34.242.25.4', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (89, '1332209877', 'user_6778', '用户介绍：4231', '地址：822', 157, 68, '1970-02-05', '自由职业', '金融', '单身', 'ESFP', '运动伙伴', '[\"美食\", \"手工\", \"收藏\", \"摄影\"]', '[\"篮球\", \"游泳\", \"健身\"]', '230.192.200.86', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (90, '1161459680', 'user_477', '用户介绍：3947', '地址：8305', 199, 61, '1971-02-05', '学生', 'IT互联网', '单身', 'INTP', '商务合作', '[\"宠物\", \"购物\", \"看电影\", \"听音乐\"]', '[\"滑雪\", \"足球\"]', '217.192.28.206', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (91, '1397170393', 'user_9702', '用户介绍：9362', '地址：7704', 152, 95, '1990-02-05', '创业者', 'IT互联网', '已婚', 'ENTJ', '找对象', '[\"摄影\", \"健身\", \"绘画\", \"游戏\"]', '[\"滑雪\", \"舞蹈\"]', '78.188.221.252', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (92, '1382685763', 'user_1930', '用户介绍：4846', '地址：8442', 189, 58, '1998-02-05', '自由职业', '房地产', '单身', 'ESTP', '运动伙伴', '[\"手工\", \"看电影\"]', '[\"羽毛球\", \"高尔夫\"]', '237.105.107.254', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (93, '1105954818', 'user_2098', '用户介绍：8707', '地址：7243', 150, 93, '1993-02-05', '学生', '教育', '单身', 'ENFP', '运动伙伴', '[\"健身\", \"绘画\", \"汽车\", \"钓鱼\", \"园艺\"]', '[\"滑雪\", \"跑步\"]', '40.220.43.148', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (94, '1391274625', 'user_7455', '用户介绍：9893', '地址：7102', 179, 87, '2000-02-05', '自由职业', '房地产', '恋爱中', 'ISTP', '找对象', '[\"手工\", \"游戏\", \"读书\", \"宠物\"]', '[\"瑜伽\", \"滑板\"]', '181.220.141.62', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (95, '1925564931', 'user_5957', '用户介绍：2116', '地址：2712', 186, 88, '1973-02-05', '自由职业', 'IT互联网', '恋爱中', 'ESTJ', '商务合作', '[\"读书\", \"绘画\", \"宠物\"]', '[\"冲浪\", \"足球\"]', '148.21.42.25', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (96, '1845810615', 'user_9046', '用户介绍：1488', '地址：303', 185, 66, '2005-02-05', '学生', '其他', '单身', 'INTP', '找对象', '[\"旅行\"]', '[\"乒乓球\", \"高尔夫\"]', '7.239.9.224', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (97, '1211691799', 'user_1941', '用户介绍：6198', '地址：5166', 186, 44, '2000-02-05', '创业者', '房地产', '恋爱中', 'INFJ', '交朋友', '[\"读书\", \"手工\", \"烹饪\", \"健身\"]', '[\"跑步\", \"篮球\", \"滑雪\"]', '227.164.170.162', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (98, '1807778919', 'user_8809', '用户介绍：1713', '地址：2138', 178, 48, '2007-02-05', '创业者', '其他', '恋爱中', 'ESTP', '交朋友', '[\"美食\", \"钓鱼\", \"听音乐\", \"旅行\", \"收藏\"]', '[\"跑步\", \"乒乓球\"]', '80.86.222.136', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (99, '1633682483', 'user_9784', '用户介绍：8815', '地址：4726', 186, 50, '1976-02-05', '学生', '金融', '已婚', 'ESFP', '找对象', '[\"钓鱼\", \"时尚\", \"听音乐\", \"健身\", \"购物\"]', '[\"乒乓球\"]', '178.192.226.70', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (100, '1422099811', 'user_8246', '用户介绍：4601', '地址：8269', 188, 57, '1999-02-05', '学生', '教育', '已婚', 'ENFJ', '商务合作', '[\"旅行\", \"收藏\", \"购物\", \"看电影\"]', '[\"瑜伽\", \"滑板\"]', '123.172.26.69', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (101, '1533326833', 'user_3007', '用户介绍：5040', '地址：6179', 179, 42, '1989-02-05', '职场人', '教育', '恋爱中', 'ENTJ', '商务合作', '[\"购物\"]', '[\"瑜伽\", \"滑雪\"]', '112.35.90.5', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (102, '1854146595', 'user_3005', '用户介绍：8783', '地址：4902', 191, 77, '1982-02-05', '职场人', '金融', '已婚', 'ESFJ', '交朋友', '[\"科技\", \"读书\", \"听音乐\", \"旅行\"]', '[\"健身\"]', '44.45.21.156', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (103, '1712248297', 'user_5443', '用户介绍：3545', '地址：1394', 182, 85, '1971-02-05', '创业者', '房地产', '恋爱中', 'ISFP', '运动伙伴', '[\"汽车\", \"宠物\", \"健身\", \"绘画\"]', '[\"健身\", \"游泳\"]', '161.81.209.121', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (104, '1219777401', 'user_6261', '用户介绍：5372', '地址：8077', 171, 83, '1995-02-05', '学生', '金融', '恋爱中', 'ISTP', '商务合作', '[\"瑜伽\"]', '[\"骑行\", \"跑步\"]', '50.44.191.224', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (105, '1178436100', 'user_8282', '用户介绍：7883', '地址：4570', 196, 53, '1991-02-05', '学生', '金融', '已婚', 'INFJ', '运动伙伴', '[\"宠物\", \"美食\", \"读书\", \"绘画\"]', '[\"滑板\"]', '90.179.18.153', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (106, '1238077510', 'user_3458', '用户介绍：5866', '地址：8960', 186, 95, '1990-02-05', '创业者', 'IT互联网', '恋爱中', 'ENFJ', '运动伙伴', '[\"旅行\", \"汽车\", \"烹饪\"]', '[\"足球\", \"健身\", \"羽毛球\"]', '113.10.12.9', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (107, '1776817404', 'user_5479', '用户介绍：4351', '地址：5318', 168, 50, '1973-02-05', '创业者', '金融', '单身', 'ESFP', '找对象', '[\"钓鱼\", \"游戏\", \"看电影\"]', '[\"游泳\"]', '174.31.79.214', 1, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (108, '1587181295', 'user_7935', '用户介绍：3522', '地址：3805', 193, 45, '1968-02-05', '学生', 'IT互联网', '恋爱中', 'INFP', '交朋友', '[\"瑜伽\", \"钓鱼\"]', '[\"舞蹈\", \"滑雪\", \"羽毛球\"]', '75.221.186.132', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
INSERT INTO `user` (`id`, `phone`, `nickname`, `introduction`, `location`, `height`, `weight`, `birthday`, `role_type`, `industry`, `emotion_status`, `mbti`, `dating_purpose`, `interests`, `sports`, `ip_address`, `is_verified`, `is_deleted`, `delete_time`, `created_at`, `updated_at`) VALUES (109, '1695906072', 'user_958', '用户介绍：6021', '地址：7233', 191, 93, '1966-02-05', '自由职业', '金融', '恋爱中', 'ENFP', '运动伙伴', '[\"健身\", \"科技\", \"钓鱼\"]', '[\"羽毛球\"]', '105.217.220.117', 0, 0, NULL, '2025-02-05 21:32:26', '2025-02-05 21:32:26');
COMMIT;

-- ----------------------------
-- Table structure for user_avatar
-- ----------------------------
DROP TABLE IF EXISTS `user_avatar`;
CREATE TABLE `user_avatar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `avatar_url` varchar(255) NOT NULL COMMENT '头像URL',
  `sort_order` int(11) DEFAULT '0' COMMENT '排序顺序',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户头像表';

-- ----------------------------
-- Records of user_avatar
-- ----------------------------
BEGIN;
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (1, 1, 'http://example.com/avatar1.jpg', 0, '2024-01-18 10:00:00');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (2, 1, 'http://example.com/avatar2.jpg', 1, '2024-01-18 10:00:00');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (3, 2, 'http://example.com/avatar3.jpg', 0, '2024-01-18 10:00:00');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (4, 3, 'http://example.com/avatar4.jpg', 0, '2024-01-18 10:00:00');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (9, 6, 'http://localhost:8081/image/d899eb69d9.png', 0, '2025-01-19 16:12:45');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (10, 7, 'http://localhost:8081/image/409c36a92a.png', 0, '2025-01-19 22:03:22');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (11, 6, 'http://localhost:8081/image/3d4baf809a.png', 0, '2025-01-20 13:51:25');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (12, 6, 'http://localhost:8081/image/32378fa22f.png', 0, '2025-01-20 13:51:28');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (13, 6, 'http://localhost:8081/image/f64735bde1.png', 0, '2025-01-24 17:41:47');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (14, 6, 'http://localhost:8081/image/a3da5ea514.png', 0, '2025-01-24 22:50:46');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (15, 93, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (16, 33, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (17, 90, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (18, 79, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (19, 105, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (20, 59, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (21, 24, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (22, 84, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (23, 97, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (24, 87, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (25, 104, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (26, 106, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (27, 83, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (28, 62, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (29, 76, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (30, 37, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (31, 51, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (32, 13, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (33, 77, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (34, 39, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (35, 89, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (36, 75, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (37, 49, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (38, 30, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (39, 70, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (40, 72, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (41, 4, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (42, 8, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (43, 9, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (44, 19, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (45, 92, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (46, 43, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (47, 94, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (48, 91, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (49, 100, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (50, 50, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (51, 78, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (52, 56, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (53, 18, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (54, 10, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (55, 74, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (56, 65, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (57, 1, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (58, 47, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (59, 81, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (60, 101, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (61, 14, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (62, 16, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (63, 55, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (64, 86, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (65, 6, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (66, 7, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (67, 108, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (68, 53, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (69, 88, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (70, 61, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (71, 66, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (72, 34, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (73, 82, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (74, 46, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (75, 99, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (76, 54, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (77, 44, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (78, 73, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (79, 48, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (80, 29, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (81, 80, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (82, 27, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (83, 69, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (84, 17, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (85, 23, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (86, 36, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (87, 109, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (88, 12, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (89, 103, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (90, 38, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (91, 40, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (92, 41, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (93, 107, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (94, 32, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (95, 25, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (96, 21, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (97, 85, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (98, 58, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (99, 98, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (100, 26, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (101, 45, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (102, 22, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (103, 52, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (104, 63, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (105, 96, 'https://randomuser.me/api/portraits/men/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (106, 102, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (107, 67, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (108, 15, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (109, 64, 'https://randomuser.me/api/portraits/men/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (110, 57, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (111, 28, 'https://randomuser.me/api/portraits/women/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (112, 68, 'https://randomuser.me/api/portraits/women/4.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (113, 20, 'https://randomuser.me/api/portraits/women/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (114, 11, 'https://randomuser.me/api/portraits/women/3.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (115, 95, 'https://randomuser.me/api/portraits/men/5.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (116, 42, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (117, 35, 'https://randomuser.me/api/portraits/men/1.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (118, 31, 'https://randomuser.me/api/portraits/women/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (119, 71, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
INSERT INTO `user_avatar` (`id`, `user_id`, `avatar_url`, `sort_order`, `created_at`) VALUES (120, 60, 'https://randomuser.me/api/portraits/men/2.jpg', 0, '2025-02-05 21:32:26');
COMMIT;

-- ----------------------------
-- Table structure for user_privacy
-- ----------------------------
DROP TABLE IF EXISTS `user_privacy`;
CREATE TABLE `user_privacy` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `hide_popularity` tinyint(1) DEFAULT '0' COMMENT '是否隐藏人气',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='用户隐私设置表';

-- ----------------------------
-- Records of user_privacy
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Procedure structure for GenerateRandomInterests
-- ----------------------------
DROP PROCEDURE IF EXISTS `GenerateRandomInterests`;
delimiter ;;
CREATE PROCEDURE `GenerateRandomInterests`(OUT result JSON)
BEGIN
    DECLARE interest_count INT;
    SET interest_count = FLOOR(RAND() * 5 + 1);
    SELECT JSON_ARRAYAGG(interest) INTO result
    FROM (
        SELECT interest
        FROM temp_interest
        ORDER BY RAND()
        LIMIT interest_count
    ) sub_interest;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GenerateRandomSports
-- ----------------------------
DROP PROCEDURE IF EXISTS `GenerateRandomSports`;
delimiter ;;
CREATE PROCEDURE `GenerateRandomSports`(OUT result JSON)
BEGIN
    DECLARE sports_count INT;
    SET sports_count = FLOOR(RAND() * 3 + 1);
    SELECT JSON_ARRAYAGG(sports) INTO result
    FROM (
        SELECT sports
        FROM temp_sports
        ORDER BY RAND()
        LIMIT sports_count
    ) sub_sports;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
