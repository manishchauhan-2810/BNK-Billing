import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../components/ui/PageHeader';
import TreatmentSelector from '../components/billing/TreatmentSelector';
import ChargeTable from '../components/billing/ChargeTable';
import PaymentSection from '../components/billing/PaymentSection';
import BillPreview from '../components/billing/BillPreview';
import { billService } from '../services/billService';
import { DOCTORS, BILL_TYPES } from '../utils/constants';
import { preventWheelChange } from '../utils/uiHelpers';

const CreateBillPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      registrationDate: new Date().toISOString().split('T')[0],
      billDate: new Date().toISOString().split('T')[0],
      gender: 'Male',
      referredBy: ''
    }
  });

  const [billType, setBillType] = useState('PHYSIO');
  const [ctRates, setCtRates] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [items, setItems] = useState([{ particular: '', amount: '' }]);
  const [discount, setDiscount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [billData, setBillData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the CT scan rate list once so the "Quick Add" dropdown is ready as
  // soon as someone switches to that tab.
  useEffect(() => {
    billService.getCtScanRates()
      .then(setCtRates)
      .catch(() => setCtRates([]));
  }, []);

  const handleTabChange = (nextType) => {
    if (nextType === billType) return;
    setBillType(nextType);
    // Reset the parts of the form that don't make sense across tabs so a
    // half-filled physio form doesn't leak into a CT scan bill or vice versa.
    setItems([{ particular: '', amount: '' }]);
    setTreatments([]);
    reset({
      patientName: '',
      age: '',
      phone: '',
      address: '',
      referredBy: '',
      diagnosis: '',
      numberOfDays: '',
      registrationDate: new Date().toISOString().split('T')[0],
      billDate: new Date().toISOString().split('T')[0],
      gender: 'Male'
    });
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const validDiscount = Math.min(Math.max(parseFloat(discount) || 0, 0), subtotal);
    const grandTotal = subtotal - validDiscount;
    const validPaidAmount = Math.min(Math.max(parseFloat(paidAmount) || 0, 0), grandTotal);
    return { subtotal, discount: validDiscount, grandTotal, paidAmount: validPaidAmount };
  };

  const onPreview = (data) => {
    const validItems = items.filter(item => item.particular.trim() && parseFloat(item.amount) > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid charge item.');
      return;
    }

    const totals = calculateTotals();

    setBillData({
      ...data,
      billType,
      treatments: billType === 'PHYSIO' ? treatments : [],
      items: validItems,
      ...totals,
      paymentMethod,
      paymentRemarks: remarks
    });

    setIsPreviewOpen(true);
  };

  const onSave = async () => {
    try {
      setIsSubmitting(true);

      // Field names/units here must match the backend exactly:
      // - patient.age/gender/phone/address (nested, not patientDetails)
      // - chargeItems[].amount and discount and initialPayment.amount are
      //   sent as plain RUPEE numbers — billService.createNewBill() on the
      //   backend does the *100 -> paise conversion itself. Pre-converting
      //   here (like the old code did with rupeesToPaise) double-converts
      //   and was the reason bills weren't saving correctly.
      const payload = {
        billType: billData.billType,
        patient: {
          name: billData.patientName,
          age: parseInt(billData.age),
          gender: billData.gender,
          phone: billData.phone,
          address: billData.address
        },
        referredBy: billData.referredBy || undefined,
        registrationDate: billData.registrationDate,
        billDate: billData.billDate,
        numberOfDays: billData.numberOfDays ? parseInt(billData.numberOfDays) : 0,
        diagnosis: billData.diagnosis,
        treatments: billData.treatments,
        chargeItems: billData.items.map(i => ({
          particular: i.particular,
          amount: parseFloat(i.amount)
        })),
        discount: billData.discount || 0
      };

      if (billData.paidAmount > 0) {
        payload.initialPayment = {
          amount: billData.paidAmount,
          method: billData.paymentMethod
        };
      }

      const result = await billService.createBill(payload);
      toast.success('Bill generated successfully!');
      navigate(`/bills/${result._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setIsSubmitting(false);
      setIsPreviewOpen(false);
    }
  };

  const isCtScan = billType === 'CTSCAN';

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Create New Bill"
        subtitle="Generate an invoice for patient treatment"
      />

      {/* Bill type tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {BILL_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => handleTabChange(t.value)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              billType === t.value
                ? 'bg-white text-bnk-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onPreview)} className="space-y-6">
        {/* Section 1: Patient Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
              <input type="text" {...register('patientName', { required: 'Name is required' })} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm" />
              {errors.patientName && <p className="mt-1 text-xs text-red-600">{errors.patientName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  onWheel={preventWheelChange}
                  placeholder="e.g. 34"
                  className="no-spinner w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm"
                  {...register('age', { required: 'Required', min: { value: 1, message: 'Invalid age' } })}
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select {...register('gender')} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" {...register('phone')} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isCtScan ? 'Referred By (Hospital / Doctor)' : 'Referred By (Doctor)'}
              </label>
              {isCtScan ? (
                <input
                  type="text"
                  {...register('referredBy')}
                  placeholder="e.g. S.N Hospital & Heart Center, Ranikhet"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm"
                />
              ) : (
                <select {...register('referredBy')} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm bg-white">
                  <option value="">Select a doctor...</option>
                  {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea {...register('address', { required: 'Address is required' })} rows="2" className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm resize-none"></textarea>
              {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
            </div>

            <div className={`grid grid-cols-2 ${isCtScan ? '' : 'md:grid-cols-3'} gap-4 md:col-span-2`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reg Date</label>
                <input type="date" {...register('registrationDate')} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date *</label>
                <input type="date" {...register('billDate', { required: true })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </div>
              {!isCtScan && (
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Therapy Days</label>
                  <input
                    type="number"
                    min="1"
                    onWheel={preventWheelChange}
                    className="no-spinner w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    {...register('numberOfDays')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Diagnosis */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{isCtScan ? 'Clinical Notes / Diagnosis' : 'Diagnosis Details'}</h2>
          <textarea
            {...register('diagnosis')}
            rows="3"
            placeholder="Enter diagnosis details..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-bnk-secondary focus:border-bnk-secondary text-sm"
          ></textarea>
        </div>

        {/* Section 3: Treatments (physiotherapy only) */}
        {!isCtScan && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Treatments</h2>
            <TreatmentSelector
              selectedTreatments={treatments}
              onChange={setTreatments}
            />
          </div>
        )}

        {/* Section 4: Charges */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{isCtScan ? 'Procedures & Rates' : 'Charges & Items'}</h2>
          <ChargeTable
            items={items}
            setItems={setItems}
            discount={discount}
            setDiscount={setDiscount}
            quickAddOptions={isCtScan ? ctRates : undefined}
          />
        </div>

        {/* Section 5: Payment */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h2>
          <PaymentSection
            grandTotal={calculateTotals().grandTotal}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            remarks={remarks}
            setRemarks={setRemarks}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-bnk-primary hover:bg-[#1a5a4d] text-white font-medium rounded-xl shadow-md transition-colors"
          >
            Preview Bill
          </button>
        </div>
      </form>

      <BillPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onConfirm={onSave}
        data={billData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CreateBillPage;