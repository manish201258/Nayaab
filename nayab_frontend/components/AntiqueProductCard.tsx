import React from 'react';
import { Heart, ShoppingCart, Star, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useCart } from "@/context/cartContext";
import { useWishlist } from "@/context/wishlistContext";

export interface AntiqueProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  era: string;
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  isWishlisted?: boolean;
  seller: string;
  inStock: boolean;
  featured?: boolean;
}

interface AntiqueProductCardProps {
  product: AntiqueProduct;
  onAddToCart?: (product: AntiqueProduct) => void;
  onToggleWishlist?: (product: AntiqueProduct) => void;
  onViewDetails?: (product: AntiqueProduct) => void;
  inCart?: boolean;
  onGoToCart?: () => void;
}

export const AntiqueProductCard: React.FC<AntiqueProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  inCart,
  onGoToCart,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-[#f9f6f1] text-[#B8956A] border-[#B8956A]/30';
      case 'Very Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-[#f9f6f1] text-[#B8956A] border-[#B8956A]/30';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Very Rare': return 'bg-yellow-200 text-yellow-900 border-yellow-300';
      case 'Rare': return 'bg-[#B8956A] text-white border-[#7c5c2b]'; // darker for visibility
      case 'Uncommon': return 'bg-[#A0845A]/10 text-[#A0845A] border-[#A0845A]/20';
      default: return 'bg-[#f9f6f1] text-[#B8956A] border-[#B8956A]/30';
    }
  };

  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Card className="relative bg-white rounded-xl shadow-md flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg min-w-[180px] max-w-[210px] mx-auto">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-white/95 rounded-full shadow-md hover:bg-red-50 w-7 h-7"
        onClick={e => { e.stopPropagation(); e.preventDefault(); toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image }); }}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
        />
      </Button>

      {/* Product Image */}
      <div className="relative w-full h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {/* Rarity Badge only */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Badge className={`font-medium text-xs px-2 py-0.5 ${getRarityColor(product.rarity)}`}>{product.rarity}</Badge>
        </div>
        {/* Quick View Button / Sold Out Badge at bottom right */}
        { !product.inStock && (
          <span
            className="absolute bottom-2 right-2 bg-red-500 text-white text-[10px] font-semibold rounded-full px-2 py-0.5 shadow-sm"
            style={{ pointerEvents: 'none' }}
          >
            Sold Out
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between p-3 space-y-2 bg-white">
        {/* Category & Era & Featured */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5 w-full">
          <span className="capitalize font-medium">{product.category}</span>
          <div className="flex items-center gap-1 ml-2">
            {product.era && product.era !== 'Unknown Era' && (
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="h-2.5 w-2.5" />
                {product.era}
              </span>
            )}
            {product.featured && (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[8px] font-bold rounded-full shadow-sm ml-1">★ Featured</span>
            )}
          </div>
        </div>
        {/* Product Name */}
        <h3 className="font-semibold text-base text-gray-800 leading-tight mb-0.5 line-clamp-2">
          {product.name}
        </h3>
        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.description}</p>
        {/* Seller */}
        <p className="text-[10px] text-gray-500 mb-1">
          Sold by <span className="font-medium text-gray-700">{product.seller}</span>
        </p>
        {/* Price & Actions */}
        <div className="flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && (
              <span className="text-[10px] text-green-600 font-medium">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}; 