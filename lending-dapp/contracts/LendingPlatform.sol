// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LendingPlatform {
    address public owner;
    uint256 public borrowerInterestRate; // Annual interest rate for borrowers in basis points (1 basis point = 0.01%)
    uint256 public lenderInterestRate; // Annual interest rate for lenders in basis points
    uint256 public totalLent;

    struct Loan {
        address borrower;
        uint256 principal; // Initial borrowed amount
        uint256 collateral;
        uint256 dueDate;
        bool active;
    }
    struct Lend {
        address lender;
        uint256 principal; // Initial lended amount
        bool active;
    }

    mapping(address => Loan) public loans;
    mapping(address => Lend) public lends;

    event Borrowed(address indexed borrower, uint256 principal);
    event Lent(address indexed lender, uint256 amount, bool isActive);
    event Repaid(address indexed borrower, uint256 amount);
    event Withdrawn(address indexed lender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(uint256 _borrowerInterestRate, uint256 _lenderInterestRate) {
        owner = msg.sender;
        borrowerInterestRate = _borrowerInterestRate;
        lenderInterestRate = _lenderInterestRate;
    }

    function lend() external payable {
        require(msg.value > 0, "You must send some funds to lend");
        require(msg.value < msg.sender.balance, "You hve insufficient funds");
        lends[msg.sender] = Lend({
            lender: msg.sender,
            principal: msg.value,
            active: true
        });
        emit Lent(msg.sender, msg.value, lends[msg.sender].active);
    }

    function borrow(uint256 _amount, uint256 _collateral) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_collateral > 0, "Collateral must be greater than 0");
        require(
            _collateral <= msg.sender.balance,
            "Collateral must be less than your balance"
        );
        require(
            loans[msg.sender].active == false,
            "You already have an active loan"
        );
        require(
            address(this).balance >= _amount,
            "Insufficient funds in contract"
        );

        uint256 dueDate = block.timestamp + 30 days; // Due in 30 days

        loans[msg.sender] = Loan({
            borrower: msg.sender,
            principal: _amount,
            collateral: _collateral,
            dueDate: dueDate,
            active: true
        });

        totalLent += _amount;
        if (_amount <= address(this).balance) {
            payable(msg.sender).transfer(_amount); // Transfer borrowed amount directly to borrower's address
        }
        emit Borrowed(msg.sender, _amount);
    }

    function repay() external payable {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan found");
        require(
            msg.value >=
                loan.principal +
                    calculateInterest(loan.principal, borrowerInterestRate),
            "Insufficient repayment amount"
        );

        loan.active = false;

        if (
            msg.value >
            loan.principal +
                calculateInterest(loan.principal, borrowerInterestRate)
        ) {
            uint256 excess = msg.value -
                (loan.principal +
                    calculateInterest(loan.principal, borrowerInterestRate));
            payable(msg.sender).transfer(excess); // Send excess back to borrower
        }

        totalLent -= loan.principal;
        emit Repaid(msg.sender, loan.principal);
    }

    function withdrawLenderBalance() external {
      uint256 amt=  lends[msg.sender].principal+calculateInterest( lends[msg.sender].principal,  lenderInterestRate);
        require(
            address(this).balance >= amt,
            "Insufficient funds in contract"
        );

        if (lends[msg.sender].active != false) {
            payable(msg.sender).transfer(amt);
            lends[msg.sender].active = false;
            emit Withdrawn(msg.sender, amt);
        } else {
            revert("You have already withdraw your money");
        }
    }

    function calculateInterest(uint256 _amount, uint256 _interestRate)
        internal
        pure
        returns (uint256)
    {
        return (_amount * _interestRate) / 10000;
    }

    function getLoanDetails(address _borrower)
        external
        view
        returns (Loan memory)
    {
        return loans[_borrower];
    }

    function setBorrowerInterestRate(uint256 _newInterestRate)
        external
        onlyOwner
    {
        borrowerInterestRate = _newInterestRate;
    }

    function setLenderInterestRate(uint256 _newInterestRate)
        external
        onlyOwner
    {
        lenderInterestRate = _newInterestRate;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
