import React, { useRef, useState, useEffect } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ options, defaultText, setSelectedAlgorithm, setSelectedWallPattern, isAlgoStart, isAlgoEnd, type, setSelectedUserPatternSlot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultText);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option, index) => {
    if(type === 0) {
      setSelectedOption(option);
      setIsOpen(false);
      setSelectedWallPattern(option);
    }
    else if(type === 1) {
      setSelectedOption(option);
      setIsOpen(false);
      setSelectedAlgorithm(option);
    }
    else if(type === 2) {
      setSelectedOption(option);
      setIsOpen(false);
      setSelectedUserPatternSlot(option);
    }
  };

  const handleClickOutside = (event) => {
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  // look more into event listener and document
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownButton} ref={dropdownRef}>
      <button onClick={toggleDropdown} className={styles.dropdownButton} disabled={isAlgoStart && !isAlgoEnd}>
        {selectedOption}
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option, index)}
              className={styles.dropdownItem}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
