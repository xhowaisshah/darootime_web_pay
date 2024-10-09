import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { amount, userId, documentId } = await req.json();

  if (!amount || !userId || !documentId) {
    return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const url = 'https://gateway.zibal.ir/v1/request';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant: 'zibal', // Replace with your actual merchant ID
        amount,
        callbackUrl: `${process.env.NEXTAUTH_URL}/zibal?userId=${userId}&documentId=${documentId}`,
      }),
    });

    const responseData = await response.json();

    if (responseData.result === 100) {
      const trackId = responseData.trackId;
      return NextResponse.json({
        message: 'Payment Initiation Successful',
        trackId,
        url: `https://gateway.zibal.ir/start/${trackId}`
      }, { status: 200 });
    } else {
      return NextResponse.json({
        message: 'Payment Initiation Failed',
        error: responseData.message
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: 'Unable to initiate payment at this time.'
    }, { status: 500 });
  }
}