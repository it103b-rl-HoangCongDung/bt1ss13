const prompt = require('prompt-sync')({ sigint: true });

let tickets = [
    { pnr: 'VN123', passengerName: 'Nguyen Van A', flightNumber: 'VN180', seatClass: 'ECONOMY', status: 'BOOKED', excessFee: 0 },
    { pnr: 'VN456', passengerName: 'Tran Thi B', flightNumber: 'VN182', seatClass: 'BUSINESS', status: 'BOOKED', excessFee: 0 },
    { pnr: 'VN789', passengerName: 'Le Van C', flightNumber: 'VN184', seatClass: 'ECONOMY', status: 'CHECKED_IN', excessFee: 150000 }
];

function findTicketByPnr(pnrCode) {
    return tickets.find(t => t.pnr.toUpperCase() === pnrCode.toUpperCase());
}

function calculateExcessBaggageFee(seatClass, weight) {
    let allowance = seatClass === 'BUSINESS' ? 30 : 20;
    let excess = weight - allowance;
    if (excess > 0) {
        return excess * 50000;
    }
    return 0;
}

function displayTickets() {
    console.log('\n--- DANH SACH VE MAY BAY ---');
    console.log('PNR\t| Ho Ten\t\t| Hang\t| Trang Thai\t| Phi Qua Cuoc');
    console.log('---------------------------------------------------------');
    tickets.forEach(t => {
        console.log(`${t.pnr}\t| ${t.passengerName.padEnd(16)}\t| ${t.seatClass}\t| ${t.status.padEnd(11)}\t| ${t.excessFee} VND`);
    });
    console.log('');
}

function checkIn() {
    let pnrInput = prompt('Nhap ma PNR can check-in: ');
    let ticket = findTicketByPnr(pnrInput);
    
    if (!ticket) {
        console.log('[LOI] Khong tim thấy ma PNR nay trong he thong!');
        return;
    }
    
    if (ticket.status !== 'BOOKED') {
        console.log('[LOI] Ve nay da duoc check-in hoac da bi huy truoc do!');
        return;
    }
    
    let weight = parseFloat(prompt('Nhap trong luong hanh ly ky gui (kg): '));
    if (isNaN(weight) || weight < 0) {
        console.log('[LOI] Trong luong hanh ly khong hop le!');
        return;
    }
    
    let fee = calculateExcessBaggageFee(ticket.seatClass, weight);
    ticket.excessFee = fee;
    ticket.status = 'CHECKED_IN';
    
    console.log('\n========== BOARDING PASS ==========');
    console.log(`Ho ten hanh khach: ${ticket.passengerName}`);
    console.log(`So hieu chuyen bay: ${ticket.flightNumber}`);
    console.log(`Ma ghe / Hang: ${ticket.seatClass}`);
    console.log(`Phi qua cuoc phai thu: ${fee.toLocaleString()} VND`);
    console.log('====================================\n');
}

function searchTicket() {
    let keyword = prompt('Nhap ma Pnr hoac ten hanh khach de tra cuu: ').toLowerCase();
    let results = tickets.filter(t => t.pnr.toLowerCase().includes(keyword) || t.passengerName.toLowerCase().includes(keyword));
    
    if (results.length === 0) {
        console.log('Khong tim thay ket qua phu hop.');
    } else {
        console.log('\n--- KET QUA TRA CUU ---');
        results.forEach(t => {
            console.log(`PNR: ${t.pnr} | Ten: ${t.passengerName} | Hang: ${t.seatClass} | Trang thai: ${t.status}`);
        });
        console.log('');
    }
}

function cancelTicket() {
    let pnrInput = prompt('Nhap ma PNR cua ve can huy: ');
    let ticket = findTicketByPnr(pnrInput);
    
    if (!ticket) {
        console.log('[LOI] Khong tim thay ma PNR!');
        return;
    }
    
    if (ticket.status === 'CANCELLED') {
        console.log('Ve nay da o trang thai huy tu truoc.');
        return;
    }
    
    ticket.status = 'CANCELLED';
    console.log(`[THANH CONG] Da huy ve voi ma PNR: ${ticket.pnr}\n`);
}

function main() {
    let choice;
    do {
        console.log('=== HE THONG QUAY CHECK-IN SAN BAY ===');
        console.log('1. Hien thi danh sach ve');
        console.log('2. Tiep nhan check-in & Can hanh ly');
        console.log('3. Tra cuu thong tin ve');
        console.log('4. Huy ve');
        console.log('5. Thoat chuong trinh');
        choice = prompt('Lua chon cua ban (1-5): ');
        
        switch (choice) {
            case '1':
                displayTickets();
                break;
            case '2':
                checkIn();
                break;
            case '3':
                searchTicket();
                break;
            case '4':
                cancelTicket();
                break;
            case '5':
                console.log('Cam on ban da su dung he thong. Tam biet!');
                break;
            default:
                console.log('[LOI] Lua chon khong hop le, vui long chon lai tu 1 den 5!\n');
        }
    } while (choice !== '5');
}

main();