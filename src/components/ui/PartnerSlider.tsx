import { useGames } from '../../context/GameContext';
import { motion } from 'framer-motion';

const PartnerSlider = () => {
  const { partners } = useGames();
  const enabledPartners = partners.filter(p => p.enabled);

  if (enabledPartners.length === 0) return null;

  return (
    <div className="w-full py-8 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-gray-800">
      <div className="container">
        <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Trusted Partners & Top Studios</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {enabledPartners.map((partner) => (
            <motion.div 
              key={partner.id}
              whileHover={{ scale: 1.1 }}
              className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center"
            >
              {partner.logo && partner.logo !== '' ? (
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-gray-400 font-bold">{partner.name}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerSlider;
