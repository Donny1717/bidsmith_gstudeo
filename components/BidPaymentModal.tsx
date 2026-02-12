import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { X, CreditCard, Lock, CheckCircle, PenTool, FileText } from 'lucide-react';

interface BidPaymentModalProps {
  onClose: () => void;
}

export const BidPaymentModal: React.FC<BidPaymentModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'payment' | 'signing' | 'processing' | 'success'>('payment');
  const sigCanvas = useRef<any>({});
  const [paymentError, setPaymentError] = useState('');
  const [receiptId, setReceiptId] = useState('');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    // Mock Stripe Processing
    setTimeout(() => {
        setStep('signing');
    }, 1500);
  };

  const handleSignatureClear = () => {
    sigCanvas.current.clear();
  };

  const handleFinalizeBid = () => {
    if (sigCanvas.current.isEmpty()) {
        alert("Digital signature required to ratify bid.");
        return;
    }

    setStep('processing');
    const signatureData = sigCanvas.current.toDataURL();
    const newReceiptId = `BS-${Math.floor(Math.random() * 10000000)}`;
    setReceiptId(newReceiptId);

    // Mock Backend Verification & PDF Generation
    setTimeout(() => {
        generateReceipt(signatureData, newReceiptId);
        setStep('success');
    }, 2000);
  };

  const generateReceipt = (signatureImg: string, id: string) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(10, 10, 11); // Obsidian
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(80, 200, 120); // Emerald
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BIDSMITH ASF", 105, 20, { align: "center" });
    
    // Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("OFFICIAL BID RECEIPT", 105, 60, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${id}`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 90);
    doc.text(`Amount Paid: £500.00 GBP (Bid Ratification Fee)`, 20, 100);
    doc.text(`Status: CLEARED - STRIPE PAYMENT VERIFIED`, 20, 110);
    
    // Signature
    doc.text("Digital Signature of Authorized Agent:", 20, 140);
    doc.addImage(signatureImg, 'PNG', 20, 145, 60, 30);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This document is a legally binding ratification of the bid entry.", 20, 280);
    
    doc.save(`BidSmith_Receipt_${id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard intensity="high" className="border-t-4 border-t-emerald-500">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
             <h2 className="font-cinzel text-xl text-white">
                {step === 'success' ? 'Bid Ratified' : 'Secure Transaction'}
             </h2>
             {step !== 'success' && step !== 'processing' && (
                 <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white" /></button>
             )}
          </div>

          <div className="p-8 min-h-[400px] flex flex-col">
            
            {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6 flex-1 flex flex-col justify-center">
                    <div className="text-center mb-4">
                        <div className="text-sm font-mono text-gray-400">BID RATIFICATION FEE</div>
                        <div className="text-3xl font-cinzel text-white">£500.00 <span className="text-xs font-sans text-gray-500">GBP</span></div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-mono text-emerald-500">Cardholder Name</label>
                        <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white outline-none focus:border-emerald-500 transition-colors" placeholder="J. ARCHITECT" />
                        
                        <label className="text-[10px] uppercase font-mono text-emerald-500">Card Number</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 pl-10 rounded text-white outline-none focus:border-emerald-500 transition-colors font-mono" placeholder="0000 0000 0000 0000" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-mono text-emerald-500">Expiry</label>
                                <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white outline-none focus:border-emerald-500 transition-colors font-mono" placeholder="MM/YY" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-mono text-emerald-500">CVC</label>
                                <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white outline-none focus:border-emerald-500 transition-colors font-mono" placeholder="123" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-auto">
                        <Lock size={16} /> Process Securely
                    </button>
                    <div className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1">
                        <Lock size={10} /> TLS 1.3 ENCRYPTED VIA STRIPE
                    </div>
                </form>
            )}

            {step === 'signing' && (
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="text-center">
                        <PenTool className="mx-auto text-emerald-400 mb-2" size={32} />
                        <h3 className="font-mono text-white text-lg">Digital Signature Required</h3>
                        <p className="text-xs text-gray-400">Please sign below to ratify this bid submission.</p>
                    </div>

                    <div className="flex-1 border-2 border-dashed border-gray-700 bg-black/20 rounded relative">
                        <SignatureCanvas 
                            ref={sigCanvas}
                            penColor="white"
                            canvasProps={{ className: 'absolute inset-0 w-full h-full rounded cursor-crosshair' }}
                        />
                        <div className="absolute bottom-2 right-2 pointer-events-none text-[9px] text-gray-600 font-mono">
                            CRYPTOGRAPHIC TIMESTAMP: {Date.now()}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleSignatureClear} className="px-4 py-3 border border-white/10 text-gray-400 hover:text-white text-xs font-mono uppercase">
                            Clear
                        </button>
                        <button onClick={handleFinalizeBid} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest transition-colors">
                            Ratify & Submit
                        </button>
                    </div>
                </div>
            )}

            {step === 'processing' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                    <div className="font-mono text-emerald-400 animate-pulse">PROCESSING SECURE LEDGER...</div>
                </div>
            )}

            {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500"
                    >
                        <CheckCircle className="text-emerald-500" size={40} />
                    </motion.div>
                    
                    <div>
                        <h3 className="text-2xl font-cinzel text-white">Bid Accepted</h3>
                        <p className="text-sm text-gray-400 font-mono mt-2">REF: {receiptId}</p>
                    </div>

                    <p className="text-xs text-gray-500 max-w-xs">
                        Your digital receipt has been downloaded automatically. A copy has been vaulted in the BidSmith Ledger.
                    </p>

                    <button onClick={onClose} className="w-full py-4 border border-white/10 hover:bg-white/5 text-white font-mono uppercase tracking-widest transition-colors mt-auto">
                        Return to Mission Control
                    </button>
                </div>
            )}

          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};