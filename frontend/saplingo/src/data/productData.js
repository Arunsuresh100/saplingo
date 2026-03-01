// src/data/productData.js

// --- Import all product images so React can process them ---
// Note: These paths are relative to this file's location in src/data/
import mangoImg from '../assets/img/shop-items/mango.png';
import lemonImg from '../assets/img/shop-items/lemon.png';
import roseImg from '../assets/img/shop-items/rose.png';
import snakeImg from '../assets/img/shop-items/snake.png';
import fiddleImg from '../assets/img/shop-items/fiddle.png';
import orchidImg from '../assets/img/shop-items/orchid.png';
import bonsaiImg from '../assets/img/shop-items/bonsai.png';
import peaceImg from '../assets/img/shop-items/peace.png';

// You can add your thumbnail imports back here if you have them.
// For now, we will keep it simple as the database does not use them yet.

export const allProducts = [
    { 
        id: 'mango-sapling', 
        name: 'Mango Sapling', 
        price: 15.99, 
        image: mangoImg,
        description: 'A healthy, young mango sapling ready to be planted. Known for its sweet and juicy fruits, this Alphonso variety is perfect for home gardens in warmer climates. Requires full sun and well-drained soil.',
        thumbnails: [mangoImg, mangoImg, mangoImg, mangoImg] // Placeholder thumbnails
    },
    { 
        id: 'lemon-tree', 
        name: 'Lemon Tree', 
        price: 22.00, 
        image: lemonImg,
        description: 'Enjoy fresh, homegrown lemons with this vibrant Meyer Lemon tree. It\'s a compact variety, making it suitable for both garden planting and large pots on a sunny patio.',
        thumbnails: [lemonImg, lemonImg, lemonImg, lemonImg]
    },
    { 
        id: 'rose-bush', 
        name: 'Rose Bush', 
        price: 19.99, 
        image: roseImg,
        description: 'A classic symbol of beauty, this hybrid tea rose bush produces large, fragrant blooms. It is disease-resistant and a repeat bloomer, providing color from spring until fall.',
        thumbnails: [roseImg, roseImg, roseImg, roseImg]
    },
    { 
        id: 'snake-plant', 
        name: 'Snake Plant', 
        price: 18.00, 
        image: snakeImg,
        description: 'The Sansevieria trifasciata, or Snake Plant, is a low-maintenance indoor plant known for its air-purifying qualities. Its striking upright leaves make it a modern architectural accent.',
        thumbnails: [snakeImg, snakeImg, snakeImg, snakeImg]
    },
    { 
        id: 'fiddle-leaf-fig', 
        name: 'Fiddle Leaf Fig', 
        price: 28.00, 
        image: fiddleImg,
        description: 'A statement piece for any room, the Fiddle Leaf Fig features large, violin-shaped leaves. It thrives in bright, indirect light and adds a touch of lush, tropical elegance.',
        thumbnails: [fiddleImg, fiddleImg, fiddleImg, fiddleImg]
    },
    { 
        id: 'orchid', 
        name: 'Orchid', 
        price: 35.50, 
        image: orchidImg,
        description: 'This elegant Phalaenopsis orchid boasts long-lasting, beautiful blooms. It\'s a surprisingly easy-to-care-for variety that brings a sophisticated touch to your indoor space.',
        thumbnails: [orchidImg, orchidImg, orchidImg, orchidImg]
    },
    { 
        id: 'bonsai-tree', 
        name: 'Bonsai Tree', 
        price: 45.00, 
        image: bonsaiImg,
        description: 'A living work of art, this Juniper bonsai tree is perfect for beginners. It embodies tranquility and balance, making it a wonderful addition to a desk or quiet corner.',
        thumbnails: [bonsaiImg, bonsaiImg, bonsaiImg, bonsaiImg]
    },
    { 
        id: 'peace-lily', 
        name: 'Peace Lily', 
        price: 21.00, 
        image: peaceImg,
        description: 'The Peace Lily is a popular indoor plant with elegant white blooms and glossy green leaves. It is renowned for its air-purifying abilities and and tolerance for lower light conditions.',
        thumbnails: [peaceImg, peaceImg, peaceImg, peaceImg]
    }
];