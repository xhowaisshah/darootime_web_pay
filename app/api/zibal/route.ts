import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { firebaseApp } from '../../firebase/admin'; // Import the initialized Firebase app

export const POST = async (req: NextRequest) => {
  const { trackId, status, documentId, userId } = await req.json();

  if (!trackId || !status || !documentId || !userId) {
    return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
  }

  try {
    // Verify the payment with Zibal
    const verifyResponse = await fetch('https://gateway.zibal.ir/v1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant: 'zibal', // Use your actual merchant ID
        trackId,
      }),
    });

    const responseData = await verifyResponse.json();

    if (responseData.result === 100) {
      // Payment is successful
      console.log('Payment is successful', responseData);
      const paymentAmount = responseData.amount;
      const paymentDate = responseData.paidAt;

      // Update the Firestore document's status to 'Success'
      const db = getFirestore(firebaseApp);
      const docRef = doc(collection(db, 'PaymentRequests'), documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json({
          message: 'Document not found',
          error: 'No document to update'
        }, { status: 404 });
      }

      await updateDoc(docRef, {
        status: 'Success',
        amount: paymentAmount,
        date: new Date(paymentDate),
        updatedAt: serverTimestamp(),
      });

      return NextResponse.json({
        message: 'Payment Successful',
        amount: paymentAmount,
        date: paymentDate,
        result: responseData
      }, { status: 200 });
    } else if (responseData.result === 201) {
      return NextResponse.json({
        message: 'Payment has already been verified',
        result: responseData,
        error: responseData.message
      }, { status: 200 });
    } else {
      // Payment verification failed
      console.log('Payment verification failed', responseData);

      // Update the Firestore document's status to 'Cancelled'
      const db = getFirestore(firebaseApp);
      const docRef = doc(collection(db, 'PaymentRequests'), documentId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json({
          message: 'Document not found',
          error: 'No document to update'
        }, { status: 404 });
      }

      await updateDoc(docRef, {
        status: 'Cancelled',
        error: responseData.message,
        updatedAt: serverTimestamp(),
      });

      return NextResponse.json({
        message: 'Payment Verification Failed',
        result: responseData,
        error: responseData.message
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: `Error verifying payment: ${error}`
    }, { status: 500 });
  }
};