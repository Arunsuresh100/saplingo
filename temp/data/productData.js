// src/data/productData.js

// --- Import all product images so React can process them ---
import mangoImg from '../assets/img/shop-items/mango.png';
import lemonImg from '../assets/img/shop-items/lemon.png';
import roseImg from '../assets/img/shop-items/rose.png';
import snakeImg from '../assets/img/shop-items/snake.png';
import fiddleImg from '../assets/img/shop-items/fiddle.png';
import orchidImg from '../assets/img/shop-items/orchid.png';
import bonsaiImg from '../assets/img/shop-items/bonsai.png';
import peaceImg from '../assets/img/shop-items/peace.png';

// --- IMPORTANT ---
// In a real application, you would import unique thumbnail images like this:
// import mangoThumb1 from '../assets/img/shop-items/mango-thumb-1.png';
// import mangoThumb2 from '../assets/img/shop-items/mango-thumb-2.png';
// import mangoThumb3 from '../assets/img/shop-items/mango-thumb-3.png';
import mangoThumb1 from '../assets/img/shop-items/mango-angle.png';
import mangoThumb2 from '../assets/img/shop-items/mango-closeup.png';
import mangoThumb3 from '../assets/img/shop-items/mango-in-pot.png';
// lemon
import lemonThumb1 from '../assets/img/shop-items/lemon-angle.png';
import lemonThumb2 from '../assets/img/shop-items/lemon-closeup.png';
import lemonThumb3 from '../assets/img/shop-items/lemon-in-pot.png';
// rose
import roseThumb1 from '../assets/img/shop-items/rose-angle.png';
import roseThumb2 from '../assets/img/shop-items/rose-closeup.png';
import roseThumb3 from '../assets/img/shop-items/rose-in-pot.png';
// snake
import snakeThumb1 from '../assets/img/shop-items/snake-angle.png';
import snakeThumb2 from '../assets/img/shop-items/snake-closeup.png';
import snakeThumb3 from '../assets/img/shop-items/snake-in-pot.png';
//fiddle
import fiddleThumb1 from '../assets/img/shop-items/fiddle-angle.png';
import fiddleThumb2 from '../assets/img/shop-items/fiddle-closeup.png';
import fiddleThumb3 from '../assets/img/shop-items/fiddle-in-pot.png';
//orchid
import orchidThumb1 from '../assets/img/shop-items/orchid-angle.png';
import orchidThumb2 from '../assets/img/shop-items/orchid-closeup.png';
import orchidThumb3 from '../assets/img/shop-items/orchid-in-pot.png';
//bonsai
import bonsaiThumb1 from '../assets/img/shop-items/bonsai-angle.png';
import bonsaiThumb2 from '../assets/img/shop-items/bonsai-closeup.png';
import bonsaiThumb3 from '../assets/img/shop-items/bonsai-in-pot.png';
//peace
import peaceThumb1 from '../assets/img/shop-items/peace-angle.png';
import peaceThumb2 from '../assets/img/shop-items/peace-closeup.png';
import peaceThumb3 from '../assets/img/shop-items/peace-in-pot.png';

export const allProducts = [
    { 
        id: 'mango-sapling', 
        name: 'Mango Sapling', 
        price: 15.99, 
        image: mangoImg,
        description: 'A healthy, young mango sapling ready to be planted. Known for its sweet and juicy fruits, this Alphonso variety is perfect for home gardens in warmer climates. Requires full sun and well-drained soil.',
        // CORRECTED: Thumbnails should be different views OF THE SAME MANGO SAPLING.
        // I am using the main image as a placeholder. Replace these with your actual thumbnail images.
        thumbnails: [mangoImg, mangoThumb1, mangoThumb2, mangoThumb3] 
    },
    { 
        id: 'lemon-tree', 
        name: 'Lemon Tree', 
        price: 22.00, 
        image: lemonImg,
        description: 'Enjoy fresh, homegrown lemons with this vibrant Meyer Lemon tree. It\'s a compact variety, making it suitable for both garden planting and large pots on a sunny patio.',
        // CORRECTED: All thumbnails should be of the lemon tree.
        thumbnails: [lemonImg, lemonThumb1, lemonThumb2, lemonThumb3] 

    },
    { 
        id: 'rose-bush', 
        name: 'Rose Bush', 
        price: 19.99, 
        image: roseImg,
        description: 'A classic symbol of beauty, this hybrid tea rose bush produces large, fragrant blooms. It is disease-resistant and a repeat bloomer, providing color from spring until fall.',
        // CORRECTED: All thumbnails should be of the rose bush.
        thumbnails: [roseImg, roseThumb1, roseThumb2, roseThumb3] 
    },
    { 
        id: 'snake-plant', 
        name: 'Snake Plant', 
        price: 18.00, 
        image: snakeImg,
        description: 'The Sansevieria trifasciata, or Snake Plant, is a low-maintenance indoor plant known for its air-purifying qualities. Its striking upright leaves make it a modern architectural accent.',
        // CORRECTED: All thumbnails should be of the snake plant.
        thumbnails: [snakeImg, snakeThumb1, snakeThumb2, snakeThumb3] 

    },
    { 
        id: 'fiddle-leaf-fig', 
        name: 'Fiddle Leaf Fig', 
        price: 28.00, 
        image: fiddleImg,
        description: 'A statement piece for any room, the Fiddle Leaf Fig features large, violin-shaped leaves. It thrives in bright, indirect light and adds a touch of lush, tropical elegance.',
        // CORRECTED: All thumbnails should be of the fiddle leaf fig.
        thumbnails: [fiddleImg, fiddleThumb1, fiddleThumb2, fiddleThumb3] 

    },
    { 
        id: 'orchid', 
        name: 'Orchid', 
        price: 35.50, 
        image: orchidImg,
        description: 'This elegant Phalaenopsis orchid boasts long-lasting, beautiful blooms. It\'s a surprisingly easy-to-care-for variety that brings a sophisticated touch to your indoor space.',
        // CORRECTED: All thumbnails should be of the orchid.
        thumbnails: [orchidImg, orchidThumb1, orchidThumb2, orchidThumb3] 

    },
    { 
        id: 'bonsai-tree', 
        name: 'Bonsai Tree', 
        price: 45.00, 
        image: bonsaiImg,
        description: 'A living work of art, this Juniper bonsai tree is perfect for beginners. It embodies tranquility and balance, making it a wonderful addition to a desk or quiet corner.',
        // CORRECTED: All thumbnails should be of the bonsai tree.
        thumbnails: [bonsaiImg, bonsaiThumb1, bonsaiThumb2, bonsaiThumb3] 

    },
    { 
        id: 'peace-lily', 
        name: 'Peace Lily', 
        price: 21.00, 
        image: peaceImg,
        description: 'The Peace Lily is a popular indoor plant with elegant white blooms and glossy green leaves. It is renowned for its air-purifying abilities and tolerance for lower light conditions.',
        // CORRECTED: All thumbnails should be of the peace lily.
        thumbnails: [peaceImg, peaceThumb1, peaceThumb2, peaceThumb3] 

    }
];