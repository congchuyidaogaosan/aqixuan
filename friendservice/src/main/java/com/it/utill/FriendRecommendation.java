package com.it.utill;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class FriendRecommendation {

    // 计算两个用户之间的余弦相似度
    public static double cosineSimilarity(int[] user1, int[] user2) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < user1.length; i++) {
            dotProduct += user1[i] * user2[i];
            normA += Math.pow(user1[i], 2);
            normB += Math.pow(user2[i], 2);
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        if (normA == 0 || normB == 0) {
            return 0;
        }
        return dotProduct / (normA * normB);
    }

    // 添加Jaccard相似度计算，考虑共同好友占比
    public static double jaccardSimilarity(int[] user1, int[] user2) {
        int intersectionCount = 0;
        int unionCount = 0;

        for (int i = 0; i < user1.length; i++) {
            if (user1[i] > 0 && user2[i] > 0) {
                intersectionCount++;
            }
            if (user1[i] > 0 || user2[i] > 0) {
                unionCount++;
            }
        }
        
        return unionCount == 0 ? 0 : (double) intersectionCount / unionCount;
    }
    
    // 计算用户活跃度权重 - 好友数量越多，活跃度越高
    private static double calculateActivityWeight(int[] user) {
        int friendCount = 0;
        for (int value : user) {
            if (value > 0) {
                friendCount++;
            }
        }
        // 使用对数函数平滑活跃度影响，避免过度偏向超级活跃用户
        return Math.log10(friendCount + 1) / 2.0;
    }

    // 综合相似度计算，考虑多种因素
    public static double calculateCombinedSimilarity(int[] user1, int[] user2) {
        double cosineWeight = 0.6; // 余弦相似度权重
        double jaccardWeight = 0.3; // Jaccard相似度权重
        double activityWeight = 0.1; // 活跃度权重
        
        double cosineSim = cosineSimilarity(user1, user2);
        double jaccardSim = jaccardSimilarity(user1, user2);
        double activity = calculateActivityWeight(user2);
        
        return cosineWeight * cosineSim + jaccardWeight * jaccardSim + activityWeight * activity;
    }

    // 推荐好友的主方法
    public List<Integer> recommendFriends(int[][] userFriendMatrix, int targetUser, int numRecommendations) {
        System.out.println("开始为矩阵索引为 " + targetUser + " 的用户推荐好友");
        
        // 验证矩阵维度和目标用户索引是否有效
        if (userFriendMatrix == null || userFriendMatrix.length == 0) {
            System.out.println("错误: 用户关系矩阵为空");
            return new ArrayList<>();
        }
        
        if (targetUser < 0 || targetUser >= userFriendMatrix.length) {
            System.out.println("错误: 目标用户索引 " + targetUser + " 超出矩阵范围(0-" + (userFriendMatrix.length-1) + ")");
            return new ArrayList<>();
        }
        
        int numUsers = userFriendMatrix.length;
        int numFriends = userFriendMatrix[0].length;
        
        System.out.println("矩阵维度: " + numUsers + " x " + numFriends);
        
        // 获取目标用户已经认识的朋友列表
        Set<Integer> alreadyKnownFriends = new HashSet<>();
        for (int i = 0; i < numFriends; i++) {
            if (userFriendMatrix[targetUser][i] > 0) {
                alreadyKnownFriends.add(i);
            }
        }
        
        // 务必将用户自己添加到已知列表中，避免自我推荐
        alreadyKnownFriends.add(targetUser);
        
        System.out.println("目标用户已知朋友数量: " + (alreadyKnownFriends.size() - 1)); // 减去自己
        System.out.println("已知朋友索引列表: " + alreadyKnownFriends);
        
        // 如果用户已有很多朋友，则使用基于共同好友的策略
        if (alreadyKnownFriends.size() > 5) {
            System.out.println("使用基于共同好友的推荐策略");
            return recommendBasedOnMutualFriends(userFriendMatrix, targetUser, numRecommendations, alreadyKnownFriends);
        }
        
        // 否则使用基于相似度的策略
        System.out.println("使用基于用户相似度的推荐策略");
        
        // 计算目标用户与其他用户的相似度
        Map<Integer, Double> similarityMap = new HashMap<>();
        for (int i = 0; i < numUsers; i++) {
            // 跳过自己
            if (i == targetUser) {
                continue;
            }
            
            double similarity = cosineSimilarity(userFriendMatrix[targetUser], userFriendMatrix[i]);
            if (similarity > 0) { // 只考虑有一定相似度的用户
                similarityMap.put(i, similarity);
                System.out.println("用户 " + targetUser + " 与用户 " + i + " 的相似度: " + similarity);
            }
        }
        
        System.out.println("找到 " + similarityMap.size() + " 个相似用户");
        
        // 如果没有相似用户，使用默认推荐
        if (similarityMap.isEmpty()) {
            System.out.println("没有相似用户，使用基于活跃度的默认推荐");
            return recommendBasedOnActivity(userFriendMatrix, targetUser, numRecommendations, alreadyKnownFriends);
        }
        
        // 按相似度排序
        List<Map.Entry<Integer, Double>> sortedSimilarities = new ArrayList<>(similarityMap.entrySet());
        sortedSimilarities.sort(Map.Entry.<Integer, Double>comparingByValue().reversed());
        
        System.out.println("相似用户排序: " + sortedSimilarities.stream()
                .map(e -> e.getKey() + "(" + e.getValue() + ")")
                .collect(Collectors.joining(", ")));

        // 创建潜在推荐朋友的得分映射
        Map<Integer, Double> potentialFriendsScore = new HashMap<>();
        
        // 为每个潜在朋友计算权重得分
        for (Map.Entry<Integer, Double> entry : sortedSimilarities) {
            int similarUser = entry.getKey();
            double similarityScore = entry.getValue();
            
            for (int i = 0; i < numFriends; i++) {
                // 如果是该用户的朋友，且目标用户还不认识，且不是目标用户自己
                if (userFriendMatrix[similarUser][i] > 0 && !alreadyKnownFriends.contains(i)) {
                    // 累加得分：相似度 * 关系强度
                    double relationshipStrength = userFriendMatrix[similarUser][i];
                    double score = similarityScore * relationshipStrength;
                    
                    potentialFriendsScore.merge(i, score, Double::sum);
                    System.out.println("潜在朋友 " + i + " 得分增加: " + score + " (通过用户 " + similarUser + ")");
                }
            }
        }
        
        System.out.println("潜在推荐朋友数量: " + potentialFriendsScore.size());
        
        // 如果没有潜在朋友，使用默认推荐
        if (potentialFriendsScore.isEmpty()) {
            System.out.println("没有潜在推荐朋友，尝试降低条件");
            // 尝试直接推荐相似用户，即使他们与目标用户没有共同好友
            for (Map.Entry<Integer, Double> entry : sortedSimilarities) {
                int similarUser = entry.getKey();
                // 确保不是已知朋友
                if (!alreadyKnownFriends.contains(similarUser)) {
                    potentialFriendsScore.put(similarUser, entry.getValue());
                    System.out.println("直接添加相似用户 " + similarUser + " 作为推荐，得分: " + entry.getValue());
                }
            }
            
            // 如果仍然没有推荐结果，使用基于活跃度的默认推荐
            if (potentialFriendsScore.isEmpty()) {
                System.out.println("降低条件后仍无推荐，使用基于活跃度的默认推荐");
                return recommendBasedOnActivity(userFriendMatrix, targetUser, numRecommendations, alreadyKnownFriends);
            }
        }
        
        // 确保排除用户自己
        potentialFriendsScore.remove(targetUser);
        
        // 将潜在朋友按得分从高到低排序
        List<Integer> recommendedFriends = potentialFriendsScore.entrySet().stream()
                .sorted(Map.Entry.<Integer, Double>comparingByValue().reversed())
                .limit(numRecommendations)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
                
        // 确保最终结果中不包含用户自己
        if (recommendedFriends.contains(targetUser)) {
            recommendedFriends.remove(Integer.valueOf(targetUser));
        }
        
        System.out.println("最终推荐列表: " + recommendedFriends);
        return recommendedFriends;
    }
    
    // 为了兼容静态调用，添加静态包装方法
    public static List<Integer> recommendFriendsStatic(int[][] userFriendMatrix, int targetUser, int numRecommendations) {
        return new FriendRecommendation().recommendFriends(userFriendMatrix, targetUser, numRecommendations);
    }
    
    // 添加新的基于活跃度的推荐策略，当其他策略失效时使用
    private List<Integer> recommendBasedOnActivity(int[][] userFriendMatrix, int targetUser, 
                                                 int numRecommendations, Set<Integer> alreadyKnownFriends) {
        System.out.println("使用基于活跃度的推荐策略");
        
        // 计算每个用户的活跃度（关注数量）
        Map<Integer, Integer> activityScores = new HashMap<>();
        for (int i = 0; i < userFriendMatrix.length; i++) {
            // 跳过自己和已知好友
            if (i == targetUser || alreadyKnownFriends.contains(i)) {
                continue;
            }
            
            // 计算该用户的关注数
            int friendCount = 0;
            for (int j = 0; j < userFriendMatrix[i].length; j++) {
                if (userFriendMatrix[i][j] > 0) {
                    friendCount++;
                }
            }
            
            if (friendCount > 0) {
                activityScores.put(i, friendCount);
                System.out.println("用户 " + i + " 活跃度: " + friendCount + " (关注数)");
            }
        }
        
        // 按活跃度排序
        List<Integer> activeUsers = activityScores.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(numRecommendations)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        System.out.println("基于活跃度推荐: " + activeUsers);
        return activeUsers;
    }

    // 基于共同好友数量的推荐策略 - 用于用户已有大量好友的情况
    private List<Integer> recommendBasedOnMutualFriends(int[][] userFriendMatrix, int targetUser, 
                                                      int numRecommendations, Set<Integer> alreadyKnownFriends) {
        System.out.println("计算与其他用户的共同好友数量");
        Map<Integer, Integer> mutualFriendsCount = new HashMap<>();
        
        // 确保已知好友集合中包含用户自己，防止推荐自己
        if (!alreadyKnownFriends.contains(targetUser)) {
            alreadyKnownFriends.add(targetUser);
        }
        
        // 对于每个非好友用户，计算与目标用户共同好友的数量
        for (int i = 0; i < userFriendMatrix.length; i++) {
            // 确保不推荐已知好友和用户自己
            if (!alreadyKnownFriends.contains(i)) {
                int count = 0;
                for (int j = 0; j < userFriendMatrix[targetUser].length; j++) {
                    // 如果是目标用户的好友，检查是否也是用户i的好友
                    if (userFriendMatrix[targetUser][j] > 0 && userFriendMatrix[i][j] > 0) {
                        count++;
                    }
                }
                
                if (count > 0) {
                    mutualFriendsCount.put(i, count);
                    System.out.println("用户 " + i + " 与目标用户有 " + count + " 个共同好友");
                }
            }
        }
        
        System.out.println("找到 " + mutualFriendsCount.size() + " 个有共同好友的用户");
        
        // 如果没有共同好友的用户，使用基于活跃度的默认推荐
        if (mutualFriendsCount.isEmpty()) {
            System.out.println("没有找到有共同好友的用户，使用基于活跃度的默认推荐");
            return recommendBasedOnActivity(userFriendMatrix, targetUser, numRecommendations, alreadyKnownFriends);
        }
        
        // 按共同好友数量排序并返回推荐结果
        List<Integer> recommendedFriends = mutualFriendsCount.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(numRecommendations)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
                
        // 最后再次确保结果中不包含用户自己
        if (recommendedFriends.contains(targetUser)) {
            recommendedFriends.remove(Integer.valueOf(targetUser));
        }
        
        System.out.println("基于共同好友推荐: " + recommendedFriends);
        return recommendedFriends;
    }

    public static void main(String[] args) {
        // 测试用的示例矩阵
        int[][] exampleMatrix = {
            {0, 1, 1, 0, 0},
            {1, 0, 1, 0, 0},
            {1, 1, 0, 1, 0},
            {0, 0, 1, 0, 1},
            {0, 0, 0, 1, 0}
        };
        
        // 使用静态方法进行推荐测试
        List<Integer> recommendations = recommendFriendsStatic(exampleMatrix, 0, 2);
        System.out.println("推荐结果: " + recommendations);
    }
}