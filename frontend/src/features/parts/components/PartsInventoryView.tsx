import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Wrench, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePartsInventory } from '@/features/parts/hooks/use-parts-inventory';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { AddPartModal } from '../modals/AddPartModal';
import { useToast } from '@/components/ui/ToastContext';

export function PartsInventoryView() {
  const navigate = useNavigate();
  const toast = useToast();
  const { parts, isLoading, deletePart } = usePartsInventory();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    try {
      await deletePart(id);
      toast.success('Part deleted');
    } catch (error) {
      toast.error('Failed to delete part');
    }
  };

  const getConditionBadge = (condition: string) => {
    const styles = {
      OEM: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      AFTERMARKET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      USED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return styles[condition as keyof typeof styles] || styles.AFTERMARKET;
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="6xl">
        <PageHeader title="Parts Inventory" />
        <LoadingState message="Loading inventory..." />
      </PageContainer>
    );
  }

  if (!parts || parts.length === 0) {
    return (
      <PageContainer maxWidth="4xl">
        <PageHeader title="Parts Inventory" />
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No parts in inventory"
          description="Add parts to your inventory to quickly include them in quotes"
          action={
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Part
            </Button>
          }
        />
        <AddPartModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      <PageHeader
        title="Parts Inventory"
        subtitle="Manage your parts to quickly add them to quotes"
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Part
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parts.map((part: any) => (
          <Card key={part.id} className="dark:bg-[#101A2E] dark:border-white/6">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base dark:text-white/92">{part.name}</CardTitle>
                  {part.category && (
                    <p className="text-sm text-gray-500 dark:text-white/65 mt-1">
                      {part.category}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getConditionBadge(part.condition)}`}
                >
                  {part.condition}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white/92">
                  ${parseFloat(part.price).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(part.id, part.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {part.notes && (
                <p className="text-sm text-gray-600 dark:text-white/65 mt-2">
                  {part.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AddPartModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </PageContainer>
  );
}
