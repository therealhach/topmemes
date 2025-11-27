import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const web3formsKey = '0e968d88-6c27-4c97-bd6d-e73e3bb50904';

    const formData = new FormData();
    formData.append('access_key', web3formsKey);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', `[TopMemes] ${subject}`);
    formData.append('message', message);
    formData.append('from_name', 'TopMemes Contact Form');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Web3Forms error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us on X.' },
      { status: 500 }
    );
  }
}
