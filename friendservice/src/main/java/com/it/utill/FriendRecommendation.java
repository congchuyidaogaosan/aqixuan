package com.it.utill;
import org.springframework.stereotype.Component;

import java.util.*;

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

    // 为目标用户推荐朋友
    public static List<Integer> recommendFriends(int[][] userFriendMatrix, int targetUser, int numRecommendations) {
        int numUsers = userFriendMatrix.length;
        int numFriends = userFriendMatrix[0].length;

        // 计算目标用户与其他用户的相似度
        Map<Integer, Double> similarityMap = new HashMap<>();
        for (int i = 0; i < numUsers; i++) {
            if (i != targetUser) {
                double similarity = cosineSimilarity(userFriendMatrix[targetUser], userFriendMatrix[i]);
                similarityMap.put(i, similarity);
            }
        }

        // 按相似度排序
        List<Map.Entry<Integer, Double>> sortedSimilarities = new ArrayList<>(similarityMap.entrySet());
        sortedSimilarities.sort(Map.Entry.<Integer, Double>comparingByValue().reversed());

        // 推荐朋友
        List<Integer> recommendedFriends = new ArrayList<>();
        Set<Integer> alreadyKnownFriends = new HashSet<>();
        for (int i = 0; i < userFriendMatrix[targetUser].length; i++) {
            if (userFriendMatrix[targetUser][i] > 0) {
                alreadyKnownFriends.add(i);
            }
        }

        for (Map.Entry<Integer, Double> entry : sortedSimilarities) {
            int similarUser = entry.getKey();
            for (int i = 0; i < numFriends; i++) {
                if (userFriendMatrix[similarUser][i] > 0 && !alreadyKnownFriends.contains(i)) {
                    recommendedFriends.add(i);
                    alreadyKnownFriends.add(i);
                    if (recommendedFriends.size() >= numRecommendations) {
                        return recommendedFriends;
                    }
                }
            }
        }

        return recommendedFriends;
    }

    public static void main(String[] args) {
        // 示例用户-朋友矩阵
        int[][] userFriendMatrix1 = {
                {1, 1, 0, 0},
                {1, 0, 1, 0},
                {0, 1, 1, 0},
                {0, 0, 0, 1}
        };

        int[][] userFriendMatrix = {
                {1, 0, 1, 0, 0, 1},
                {1, 0, 0, 1, 0, 0},
                {1, 0, 0, 1, 0, 0},
                {0, 0, 1, 0, 0, 0},
                {0, 0, 0, 0, 1, 0},
                {0, 1, 0, 1, 0, 1}};


        int targetUser = 0;
        int numRecommendations = 2;

        List<Integer> recommendedFriends = recommendFriends(userFriendMatrix, targetUser, numRecommendations);
        System.out.println("为用户 " + targetUser + " 推荐的朋友：" + recommendedFriends);
    }
}