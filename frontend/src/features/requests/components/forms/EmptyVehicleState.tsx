import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Car, ArrowRight } from 'lucide-react';

/**
 * Component shown when user has no vehicles but wants to create a request.
 * 
 * Phase 1 Premium: Request-first flow - vehicle is optional, not required.
 * User can proceed without a vehicle or add one for better quotes.
 * 
 * @component
 */
export function EmptyVehicleState() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Card className="dark:bg-[#101A2E] dark:border-white/6">
          <CardContent className="text-center py-16">
            <motion.div 
              className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Car className="w-8 h-8 text-slate-900" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white/92 mb-2">No vehicles yet?</h2>
            <p className="text-gray-600 dark:text-white/65 mb-6 max-w-md mx-auto">
              Add a vehicle for faster, more accurate quotes — or skip for now and describe your service need.
            </p>
            <div className="flex gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => navigate({ to: '/owner/vehicles/new' })}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                >
                  <Car className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    // Continue without vehicle - parent will handle this
                    const event = new CustomEvent('skipVehicle');
                    window.dispatchEvent(event);
                  }}
                  className="dark:border-white/12 dark:text-white/92 dark:hover:bg-white/10"
                >
                  Skip for now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
}
