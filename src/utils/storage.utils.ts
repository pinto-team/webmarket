// Clean up deprecated localStorage keys from old payment flow
export const cleanupOldPaymentStorage = () => {
  const keysToRemove = [
    'pending_order_id',
    'payment_url',
    'draft_order',
    'order_expires_at'
  ];

  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
};

// Clean up on app initialization
if (typeof window !== 'undefined') {
  cleanupOldPaymentStorage();
}
