'use client';

import { Suspense } from 'react';
import { Steps } from '@/components/checkout/Steps';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import CartSummary from '@/app/checkout/components/CartSummary';
import BillingAddress from './components/BillingAddress';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SavedCard {
  id: string;
  brand?: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
}

interface Checkout2PageProps {
  savedCards?: SavedCard[];
  deliveryAddress?: string;
  onConfirmPayment?: (paymentData: {
    paymentMethod: 'card' | 'cash_on_delivery';
    paymentMethodId?: string;
    billingSameAsDelivery: boolean;
  }) => Promise<void>;
  cardsLoading?: boolean;
  onAddCard?: (card: {
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  }) => Promise<void>;
}

function CheckoutContent({
  savedCards = [],
  onConfirmPayment,
  cardsLoading = false,
  onAddCard,
}: Checkout2PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shippingAddress = searchParams.get('address') || '';
  const shippingCity = searchParams.get('city') || '';
  const shippingCountry = searchParams.get('country') || '';
  const shippingPostalCode = searchParams.get('postalCode') || '';
  const specialNotes = searchParams.get('specialNotes') || '';

  const fullShippingAddress = shippingAddress
    ? `${shippingAddress}, ${shippingCity}, ${shippingCountry} ${shippingPostalCode}`.trim()
    : '';

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash_on_delivery'>('cash_on_delivery');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('cash');
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaymentMethodChange = (
    method: 'card' | 'cash_on_delivery',
    id?: string
  ) => {
    setPaymentMethod(method);
    setSelectedMethodId(method === 'card' ? id || 'card_0' : 'cash');
  };

  useEffect(() => {
    if (specialNotes) {
      localStorage.setItem('specialDeliveryNotes', specialNotes);
    }
  }, [specialNotes]);

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    try {
      if (onConfirmPayment) {
        await onConfirmPayment({
          paymentMethod,
          paymentMethodId:
            paymentMethod === 'card' ? selectedMethodId : undefined,
          billingSameAsDelivery,
        });
      }
      router.push('/checkout3');
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50/30 min-h-screen">
      <Steps currentStep={2} />

      {specialNotes && (
        <div className="max-w-6xl mx-auto mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-semibold text-amber-800 mb-1">Special Delivery Notes</p>
          <p className="text-amber-700">{specialNotes}</p>
        </div>
      )}

      <PaymentMethods
        savedCards={savedCards}
        selectedMethod={selectedMethodId}
        billingSameAsDelivery={billingSameAsDelivery}
        onPaymentMethodChange={handlePaymentMethodChange}
        onBillingSameChange={setBillingSameAsDelivery}
        cardsLoading={cardsLoading}
        onAddCard={onAddCard}
        hasShippingAddress={!!shippingAddress}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 w-full">
        <CartSummary quantity={0} totalH={0} />

        <BillingAddress
          shippingAddress={shippingAddress}
          shippingCity={shippingCity}
          shippingCountry={shippingCountry}
          shippingPostalCode={shippingPostalCode}
          deliveryAddress={fullShippingAddress}
          billingSameAsDelivery={billingSameAsDelivery}
          onBillingSameChange={setBillingSameAsDelivery}
          hasShippingAddress={!!shippingAddress}
        />
      </div>

      <div className="mt-10 flex ml-5">
        <button
          onClick={handleConfirmPayment}
          disabled={isSubmitting}
          className="w-full md:w-100 bg-[#004a61] hover:bg-[#003649] h-12 text-white font-bold rounded-lg disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting
            ? 'Creating Order...'
            : 'Confirm Payment & Place order'}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage2(props: Checkout2PageProps) {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto p-6">Loading...</div>}>
      <CheckoutContent {...props} />
    </Suspense>
  );
}
