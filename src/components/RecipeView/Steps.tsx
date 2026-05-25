import React, { useRef } from 'react';
import classes from './Steps.module.css';

type Props = {
  steps: string[];
};

// Checks if the entire text of step is emphasized and therefore is a header
const isHeaderStep = (step: string) => {
  const checkFormatting = step.match(/_.+?_/g);
  if (checkFormatting?.length === 1 && checkFormatting[0] === step) {
    return true;
  }
  return false;
};

const getStepNumbers = (steps: string[]): number[] => {
  let num = 1;
  const numbers: number[] = [];
  steps.forEach((step) => {
    if (isHeaderStep(step)) {
      numbers.push(0);
      num = 1;
    } else {
      numbers.push(num);
      num++;
    }
  });
  return numbers;
};

const Steps: React.FC<Props> = ({ steps }) => {
  const footnoteCount = useRef(1);
  const stepNumbers = getStepNumbers(steps);

  return (
    <div className={classes.stepsContainer}>
      {steps.map((step, i) => (
        <div key={i} className={classes.stepContainer}>
          {isHeaderStep(step) ? (
            <>
              <div className={classes.headerStepIndicator} />
              <div className={classes.headerStepText}>{step.slice(1, -1)}</div>
            </>
          ) : (
            <>
              <div className={classes.stepNumber}>
                <div>{stepNumbers[i]}</div>
              </div>
              <div className={classes.step}>
                {step.split('*').map((section, j, arr) => (
                  <React.Fragment key={j}>
                    <FormattedStep text={section} />
                    {j !== arr.length - 1 && (
                      <span className={classes.superscript}>[{footnoteCount.current++}]</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const FormattedStep: React.FC<{ text: string }> = ({ text }) => {
  const headers = text.match(/_.+?_/g);
  if (headers) {
    return (
      <>
        {text.split(/_.+_/).map((section, i, arr) => (
          <React.Fragment key={i}>
            <>{section}</>
            {i !== arr.length - 1 && (
              <span className={classes.sectionHeader}>{headers[i].slice(1, -1)}</span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  } else {
    return <>{text}</>;
  }
};

export default Steps;
