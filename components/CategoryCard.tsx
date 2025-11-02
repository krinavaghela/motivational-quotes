'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Category } from '@/lib/categories';

interface CategoryCardProps {
  category: Category;
  index: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: `linear-gradient(135deg, ${category.gradient[0]} 0%, ${category.gradient[1]} 100%)`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: `0 12px 24px ${alpha(category.color, 0.4)}`,
          },
        }}
        elevation={2}
      >
        <CardContent
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: 200,
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              fontSize: 64,
              mb: 2,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
            }}
          >
            {category.emoji}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {category.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: alpha('#fff', 0.9),
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {category.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;


